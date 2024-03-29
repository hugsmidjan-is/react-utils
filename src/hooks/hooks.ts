import * as React from 'react';
import { useEffect, useRef, EffectCallback, useState } from 'react';
import domid from '@hugsmidjan/qj/domid';

// @ts-expect-error  (transparently feature-detect useId hook, which is introduced in React@18)
const useId: () => string = React.useId;

/**
 * Returns a stable, unique ID string.
 *
 * Uses useId from React@18 when available, but falls back on a custom id
 * generator. (The custom generator causes angry hydration warnings in dev
 * mode).
 */
export const useDomid = useId
	? (staticId?: string) => {
			const id = useId();
			return staticId || id;
	  }
	: (staticId?: string) => useRef(staticId || domid()).current;

/** Run callback only when component did mount */
export const useOnMount = (callback: EffectCallback) =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);

/** Run callback only when component unmounts */
export const useOnUnmount = (callback: () => void) => {
	const cb = useRef(callback);
	cb.current = callback;
	useEffect(() => () => cb.current(), []);
};

/** Run callback only when component did update AND deps have changed */
export const useOnUpdate = (callback: EffectCallback, deps: ReadonlyArray<unknown>) => {
	const isUpdate = useRef(false);
	const cb = useRef<EffectCallback>(callback);
	cb.current = callback;

	useEffect(
		() => {
			if (isUpdate.current) {
				return cb.current();
			}
			isUpdate.current = true;
		},
		deps // eslint-disable-line react-hooks/exhaustive-deps
	);
};

/**
 * Create a static, immutable variable based on the first input given.
 * (Runs useRef and returns it's initial .current value.)
 */
export const useConst = <I>(input: I) => useRef(input).current;

// TODO: Create a generic useKeydownCallbacks(whichCallbackMap, deps)
// and make useCallbackOnEsc dogfood it.

/**
 * Performs a callback whenever the user hits the ESC key.
 *
 * Pass `undefined` to remove the event listener
 */
export const useCallbackOnEsc = (callback: (() => void) | undefined) => {
	const cb = useRef(callback);
	const active = !!callback;
	cb.current = callback;
	useEffect(() => {
		if (!active) {
			return;
		}
		const callbackOnEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				cb.current && cb.current();
			}
		};
		document.addEventListener('keydown', callbackOnEsc);
		return () => {
			document.removeEventListener('keydown', callbackOnEsc);
		};
	}, [active]);
};

/** @deprecated Uhm... Something, something, hacky-hack?  (Might get removed in v0.5) */
export const useNotifyTopContent = (componentName: string, key = 'topContent') =>
	useOnMount(() => {
		document.documentElement.dataset[key] = componentName;
		return () => {
			delete document.documentElement.dataset[key];
		};
	});

/**
 * Indicates whether server-side rendering is supported or not.
 *
 * The `ssr-only` value is useful for cases where you need
 * to demo the server-rendered version in a browser.
 */
export type SSRSupport = boolean | 'ssr-only';

let alreadyBrowserSide = false;

const defaultSSRSupport: SSRSupport = true;
/**
 * The default value use for the optional `ssrSupport` parameter
 * on the `useIsBRowserSide` and `useIsServerSide` hooks.`
 */
export let DEFAULT_SSR_SUPPORT: SSRSupport = defaultSSRSupport;

/**
 * Low-level useState wrapper that initializes the state to one value
 * during initial render and then updates it to another value
 * once the component has been mounted.
 *
 * After that it's just a normal [value, setValue] pair.
 *
 * NOTE: The optional `ssrSupport` parameter is ignored after the initial render
 */
export const useClientState = <T, U>(
	serverState: T | (() => T),
	clientState: U | (() => U),
	/**
	 * Indicates whether server-side rendering is supported or not.
	 *
	 * The `ssr-only` value is useful for cases where you need
	 * to demo the server-rendered version in a browser.
	 */
	ssrSupport: SSRSupport = DEFAULT_SSR_SUPPORT
) => {
	const stateTuple = useState<T | U>(
		() =>
			(ssrSupport === 'ssr-only'
				? serverState
				: ssrSupport && !alreadyBrowserSide
				? serverState
				: clientState) as T | U // TODO: Remove this type assertion once @types/react and typescript have been updated
	);
	useOnMount(() => {
		alreadyBrowserSide = true;
		if (ssrSupport !== 'ssr-only') {
			stateTuple[1](clientState);
		}
	});
	return stateTuple;
};

/**
 * Returns `true` if `useEffect` has not executed yet.
 *
 * This signals that we're in "server-side rendering" mode
 * and it's not yet appropriate to do JS-driven UI enhancements.
 *
 * ```js
 * const Knob = (props) => {
 *   const [visible, setVisible] = useState(false);
 *   const isServer = useIsServerSide();
 *   const handleClick = () => {
 *     setVisible(!visible);
 *     props.onClick && props.onClick(!visible);
 *   };
 *
 *   if (isServer) {
 *     return <span className="Knob">{props.label}</span>
 *   }
 *   return (
 *     <button className="Knob" aria-pressed={visible} onClick={handleClick}>
 *       {props.label}
 *     </button>
 *   );
 * }
 * ```
 *
 * SSR support mode can optionally be set to:
 *
 * - `true` (the default) enables the serve-side phase (returns `true` then `undefined`).
 * - `false` disables (skips) the serve-side phase (always returns `undefined`).
 * - `"ssr-only"` disables (skips) the browser-side phase (always returns `true`).
 *
 * NOTE: The `ssrSupport` parameter is ignored after the initial render.
 */
export const useIsServerSide = (ssrSupport?: SSRSupport) =>
	useClientState(true, false, ssrSupport)[0] || undefined;
/**
 * Returns `true` when `useEffect` has executed.
 *
 * This signals the time to apply Progressive Enhancement.
 *
 * ```js
 * const Knob = (props) => {
 *   const [visible, setVisible] = useState(false);
 *   const isBrowser = useIsBrowserSide();
 *   const handleClick = () => {
 *     setVisible(!visible);
 *     props.onClick && props.onClick(!visible);
 *   };
 *
 *   if (isBrowser) {
 *     return (
 *       <button className="Knob" aria-pressed={visible} onClick={handleClick}>
 *         {props.label}
 *       </button>
 *     );
 *   }
 *   return <span className="Knob">{props.label}</span>
 * }
 * ```
 *
 * SSR support mode can optionally be set to:
 *
 * - `true` (the default) enables the serve-side phase (returns `true` then `undefined`).
 * - `false` disables (skips) the serve-side phase (always returns `true`).
 * - `"ssr-only"` disables (skips) the browser-side phase (always returns `undefined`).
 *
 * NOTE: The `ssrSupport` parameter is ignored after the initial render.
 */
export const useIsBrowserSide = (ssrSupport?: SSRSupport) =>
	useClientState(false, true, ssrSupport)[0] || undefined;

// ===========================================================================

const _history: Array<SSRSupport> = [];

/**
 * Allows you to set a the default SSRSupport value for the `useIsBRowserSide`
 * and `useIsServerSide` hooks.
 *
 * Example use:
 *
 * ```js
 * setDefaultSSR(false);
 * ```
 *
 * The values are pushed to a simple stack, and if you want to revert
 * a temporarily set value, use the `setDefaultSSR.pop()` method
 * to go back to the previous value. Example:
 *
 * ```js
 * setDefaultSSR('ssr-only');
 * // ...render some components...
 * setDefaultSSR.pop(); // go back to the previous state
 * ```
 *
 * You explicitly switch to using the library's default by passing `undefined`
 * as an argument — like so:
 *
 * ```js
 * setDefaultSSR(undefined);
 * ```
 */
export const setDefaultSSR = (ssrSupport: SSRSupport | undefined) => {
	DEFAULT_SSR_SUPPORT = ssrSupport != null ? ssrSupport : defaultSSRSupport;
	_history.unshift(DEFAULT_SSR_SUPPORT);
};

/**
 * Unsets the last pushed defaultSSR value
 */
setDefaultSSR.pop = () => {
	_history.shift();
	DEFAULT_SSR_SUPPORT = _history[0] != null ? _history[0] : defaultSSRSupport;
};
