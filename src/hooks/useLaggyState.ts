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

const useLaggyState: LaggyStateHook = (initialState, delay, thenState) => {
	const [currentState, setCurrent] = useState(initialState);
	const [nextState, setNext] = useState(initialState);
	const [isTransitioning, setIsTransitioning] = useState<true | undefined>();
	const timeout = useRef<NodeJS.Timeout | null>();

	const cancelTimeout = () => {
		timeout.current && clearTimeout(timeout.current);
	};

	type S = typeof currentState;

	const setState = useConst((newState: S | (() => S), customDelay = delay) => {
		setNext(newState);
		cancelTimeout();
		setIsTransitioning(true);
		timeout.current = setTimeout(() => {
			setCurrent(newState);
			setIsTransitioning(undefined);
		}, customDelay);
	});

	useEffect(
		() => {
			thenState != null && setState(thenState);
			return cancelTimeout;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return [currentState, nextState, setState, isTransitioning];
};

export default useLaggyState;
