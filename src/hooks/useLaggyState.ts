import { useState, useRef, useEffect } from 'react';
import { useConst } from './hooks';

type LaggyStateHook = <S>(
	initialState: S | (() => S),
	delay: number,
	/** The state that should be automatically transitioned to after mounting */
	thenState?: S | (() => S)
) => [
	currentState: S,
	nextState: S,
	setState: (newState: S | (() => S), customDelay?: number) => void,
	isTransitioning: true | undefined
];

// ---------------------------------------------------------------------------

const useLaggyState: LaggyStateHook = (initialState, delay, thenState = initialState) => {
	const [currentState, setCurrent] = useState(initialState);
	const [nextState, setNext] = useState(thenState);
	const timeout = useRef<NodeJS.Timeout | null>();

	const cancelTimeout = () => {
		timeout.current && clearTimeout(timeout.current);
	};

	type S = typeof currentState;

	const setState = useConst((newState: S | (() => S), customDelay = delay) => {
		setNext(newState);
		cancelTimeout();
		timeout.current = setTimeout(() => {
			timeout.current = null;
			setCurrent(newState);
		}, customDelay);
	});

	useEffect(() => {
		if (thenState != null) {
			setState(thenState);
		}
		return cancelTimeout;
	}, [setState, thenState]);

	// This is more reliable than laggingState !== instantState
	const isTransitioning = !!timeout.current || undefined;

	return [currentState, nextState, setState, isTransitioning];
};

export default useLaggyState;
