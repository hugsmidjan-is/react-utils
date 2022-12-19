import { useEffect, useRef, EffectCallback, useState } from 'react';
import domid from '@hugsmidjan/qj/domid';

// Returns a stable, unique ID string
export const useDomid = (staticId?: string) => useState(staticId || domid)[0];

// Run callback only when component did mount
export const useOnMount = (callback: EffectCallback) =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);

// export const useLayoutOnMount = (fn) => useLayoutEffect(fn, []);

// Run callback only when component unmounts
export const useOnUnmount = (callback: () => void) => {
	const cb = useRef(callback);
	cb.current = callback;
	useEffect(() => () => cb.current(), []);
};

// Run callback only when component did update AND deps have changed
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

/** Create a static, immutable variable based on the first input given.
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
 * Boolean flag indicating if server-side rendering is supported.
 *
 * The `ssr-only` value is useful for cases where you need
 * to demo the ssr version in a browser.
 */
export type SSRSupport = boolean | 'ssr-only';

export const useClientState = <T, U>(
	serverState: T | (() => T),
	clientState: U | (() => U),
	ssrSupport: boolean | 'ssr-only' = true
) => {
	const state = useState<T | U>(ssrSupport ? serverState : clientState);
	useOnMount(() => {
		// Skip if ssrSupport is 'ssr-only'
		// or if ssrSupport is false and clientState
		// has been set already.
		if (ssrSupport === true) {
			state[1](clientState);
		}
	});
	return state;
};

export const useIsServerSide = (ssrSupport?: boolean | 'ssr-only') =>
	useClientState(true, false, ssrSupport)[0] || undefined;
export const useIsBrowserSide = (ssrSupport?: boolean | 'ssr-only') =>
	useClientState(false, true, ssrSupport)[0] || undefined;
