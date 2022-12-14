import { useState, useRef, useEffect } from 'react';
import { useConst } from './hooks';

type LaggyStateRet<S> = [
	currentState: S,
	nextState: S,
	setState: (newState: S | (() => S), customDelay?: number | false) => void,
	isTransitioning: true | undefined
];

type LocalState<S> = [currentState: S, nextState: S];

const getStateValue = <S>(state: S | (() => S)) =>
	typeof state === 'function' ? (state as () => S)() : state;

// ---------------------------------------------------------------------------

const useLaggyState = <S>(
	initialState: S | (() => S),
	/** Default delay in milliseconds */
	defaultDelay: number,
	/** Sugar! A state that should be automatically transitioned to after mounting */
	thenState?: S | (() => S)
): LaggyStateRet<S> => {
	const timeout = useRef<NodeJS.Timeout | null>();
	const [[currentState, nextState], setLocalState] = useState<LocalState<S>>(() => {
		const initial = getStateValue(initialState);
		return [initial, initial];
	});

	const setState = useConst(
		(newState: S | (() => S), customDelay: number | false = defaultDelay) => {
			timeout.current && clearTimeout(timeout.current);

			const newValue = getStateValue(newState);
			if (newValue === currentState) {
				return;
			}
			if (customDelay === false) {
				// Instant update!
				setLocalState([newValue, newValue]);
			} else {
				// Debounced update!
				setLocalState([currentState, newValue]);
				timeout.current = setTimeout(
					() => setLocalState([newValue, newValue]),
					customDelay
				);
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

	const isTransitioning = currentState !== nextState || undefined;

	return [currentState, nextState, setState, isTransitioning];
	// TODO: In the next major version:
	// return [currentState, setState, nextState, isTransitioning];
};

export default useLaggyState;
