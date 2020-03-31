import { useEffect, useRef, EffectCallback, useState } from 'react';
import domid from 'qj/domid';

// Returns a stable, unique ID string
export const useDomid = (staticId?: string) => useState(staticId || domid)[0];

// Run callback only when component did mount
export const useOnMount = (callback: EffectCallback) => useEffect(callback, []);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	);
};

/** Create a static, immutable variable based on the first input given.
 * (Runs useRef and returns it's initial .current value.)
 */
export const useConst = <I>(input: I) => useRef(input).current;

// Run callback whenever the user hits the ESC key.
export const useCallbackOnEsc = (callback: EffectCallback) =>
	useOnMount(() => {
		const callbackOnEsc = (e: KeyboardEvent) => {
			if (e.which === 27) {
				// e.preventDefault();
				callback();
			}
		};
		document.addEventListener('keydown', callbackOnEsc);
		return () => {
			document.removeEventListener('keydown', callbackOnEsc);
		};
	});

export const useNotifyTopContent = (componentName: string, key = 'topContent') =>
	useOnMount(() => {
		document.documentElement.dataset[key] = componentName;
		return () => {
			delete document.documentElement.dataset[key];
		};
	});

export const useClientState = <T, U>(
	serverState: T | (() => T),
	clientState: U | (() => U)
) => {
	const state = useState<T | U>(serverState);
	useOnMount(() => {
		state[1](clientState);
	});
	return state;
};

export const useIsServerSide = () => useClientState(true as const, undefined)[0];
export const useIsBrowserSide = () => useClientState(undefined, true as const)[0];
