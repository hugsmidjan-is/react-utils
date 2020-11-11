import { useEffect, useRef, EffectCallback, useState } from 'react';
import domid from 'qj/domid';

// Returns a stable, unique ID string
export const useDomid = (staticId?: string) => useState(staticId || domid)[0];

// Run callback only when component did mount
export const useOnMount = (callback: EffectCallback) =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);

// export const useLayoutOnMount = (fn) => useLayoutEffect(fn, []);

// Run callback only when component unmounts
export const useOnUnmount = (callback: () => void | undefined) =>
	useEffect(() => callback, [callback]);

// Run callback only when component did update AND deps have changed
export const useOnUpdate = (callback: EffectCallback, deps: ReadonlyArray<unknown>) => {
	const isUpdate = useRef<boolean>();
	useEffect(
		() => {
			if (isUpdate.current) {
				return callback();
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

/** Runs callback whenever the user hits the ESC key. */
export const useCallbackOnEsc = (
	callback: () => void,
	deps: ReadonlyArray<unknown> = []
) =>
	useEffect(
		() => {
			const callbackOnEsc = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					callback();
				}
			};
			document.addEventListener('keydown', callbackOnEsc);
			return () => {
				document.removeEventListener('keydown', callbackOnEsc);
			};
		},
		deps // eslint-disable-line react-hooks/exhaustive-deps
	);

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
