import { useState, useRef, useEffect } from 'react';
import { useConst } from './hooks';

type LaggyStateHook = <S>(
	initialState: S | (() => S),
	defaultDelay: number,
	/** The state that should be automatically transitioned to after mounting */
	thenState?: S | (() => S)
) => [
	currentState: S,
	nextState: S,
	setState: (newState: S | (() => S), customDelay?: number | false) => void,
	isTransitioning: true | undefined
];

// ---------------------------------------------------------------------------

const useLaggyState: LaggyStateHook = (initialState, defaultDelay, thenState) => {
	const [currentState, setCurrent] = useState(initialState);
	const [nextState, setNext] = useState(initialState);
	const [isTransitioning, setIsTransitioning] = useState<true | undefined>();
	const timeout = useRef<NodeJS.Timeout | null>();

	type S = typeof currentState;

	const setState = useConst(
		(newState: S | (() => S), customDelay: number | false = defaultDelay) => {
			setNext(newState);
			timeout.current && clearTimeout(timeout.current);
			const updateState = () => {
				setCurrent(newState);
				setIsTransitioning(undefined);
			};
			if (customDelay === false) {
				updateState();
			} else {
				setIsTransitioning(true);
				timeout.current = setTimeout(updateState, customDelay);
			}
		}
	);

	useEffect(
		() => {
			thenState != null && setState(thenState);
			return () => {
				timeout.current && clearTimeout(timeout.current);
			};
		},
		[] // eslint-disable-line react-hooks/exhaustive-deps
	);

	return [currentState, nextState, setState, isTransitioning];
};

export default useLaggyState;
