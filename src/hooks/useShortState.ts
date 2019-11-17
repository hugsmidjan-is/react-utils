import { useState, useRef } from 'react';
import { useOnMount, useConst } from './hooks';

// TODO: Add function signtures allowing either zero args, or 2.
function useShortState<S>(initialState?: S | (() => S), duration?: number) {
	const [state, _setState] = useState<S | undefined>(initialState);
	const timeout = useRef<NodeJS.Timeout | null>();

	const cancelTimeout = () => {
		timeout.current && clearTimeout(timeout.current);
	};

	const setState = useConst((newState: S | (() => S), duration: number) => {
		_setState(newState);
		cancelTimeout();
		timeout.current = setTimeout(() => {
			timeout.current = null;
			_setState(undefined);
		}, duration);
	});

	useOnMount(() => {
		if (initialState !== undefined) {
			setState(initialState, duration || 0);
		}
		return cancelTimeout;
	});

	return [state, setState] as const;
}

export default useShortState;
