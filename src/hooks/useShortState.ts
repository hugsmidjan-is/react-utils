import { useState, useRef } from 'react';
import { useOnMount, useConst } from './hooks';

const DEFAULT_DURATION = 0;

// TODO: Add function signtures allowing either zero args, or 2.

/** State variable that always snaps back to `undefined` after `duration` milliseconds. */
const useShortState = <S>(
	/** Initial temporary state that then gets reverted back
	 * to `undefined` after `duration` milliseconds
	 * */
	initialState?: S | (() => S),

	/** Default duration, can be overridden on a case-by-case basis
	 * by passing a custom duration to the `setState` function
	 * */
	defaultDuration = DEFAULT_DURATION
) => {
	const [state, _setState] = useState<S | undefined>(initialState);
	const timeout = useRef<ReturnType<typeof setTimeout> | null>();

	const cancelTimeout = () => {
		timeout.current && clearTimeout(timeout.current);
	};

	const setState = useConst((newState: S | (() => S), duration = defaultDuration) => {
		_setState(newState);
		cancelTimeout();
		timeout.current = setTimeout(() => {
			timeout.current = null;
			_setState(undefined);
		}, duration);
	});

	useOnMount(() => {
		if (initialState !== undefined) {
			setState(initialState, defaultDuration);
		}
		return cancelTimeout;
	});

	return [state, setState] as const;
};

export default useShortState;
