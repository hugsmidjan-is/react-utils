import { useState, useRef, useEffect, useMemo } from 'react';

// ---------------------------------------------------------------------------

/**
 * A `useState` alternative with in-built support for delayed (debounced) effect.
 *
 * This is especially useful when emulating "focusin"/"focusout" events,
 * and a less jittery 'onMouseEnter'/'onMouseLeave' behavior.
 *
 * The returned `setState` function accepts an optional `customDelay` parameter.
 *
 * An explicitly falsy delay (`0` | `false` | `null`) results in a
 * immediate (normal) `setState` invocation, whereas any other value uses
 * `setTimeout` to delay the update.
 *
 * Each `setState` call automatically cancels any pending scheduled update.
 *
 * You can also use the `setState.cancel()` helper to to cancel the last
 * scheduled update, without explicitly setting a new value.
 */
export const useLaggedState = <S>(
	initialState: S | (() => S),

	/**
	 * Default delay in milliseconds.  A value of `0` results in a
	 * immediate (normal) setState invocation.
	 *
	 * NOTE: The `defaultDelay` parameter is ignored after the initial render.
	 */
	defaultDelay = 0,

	/**
	 * A state that should be automatically transitioned to after the initial mounting.
	 *
	 * Syntatic sugar equivalent to the following:
	 *
	 * ```js
	 *   const [value, _, setValue] = useLaggedState(initialState, defaultDelay);
	 *   useEffect(() => {
	 *     setValue(thenState, defaultDelay);
	 *   }, [])
	 * ```
	 */
	thenState?: S | (() => S)
): [
	currentState: S,
	setState: (
		newState: S | ((prevState: S, upcomingState: S) => S),
		customDelay?: number | false
	) => void,
	nextState: S,
	isTransitioning: true | undefined
] => {
	const timeout = useRef<NodeJS.Timeout | null>();
	type LocalState = [currentState: S, nextState: S];
	const [[currentState, nextState], setLocalState] = useState<LocalState>(() => {
		const initial =
			typeof initialState === 'function' ? (initialState as () => S)() : initialState;
		return [initial, initial];
	});

	const setState = useMemo(
		() => {
			const _setter = (
				newState: S | ((prevState: S, upcomingState: S) => S),
				customDelay?: number | null | false
			) => {
				timeout.current && clearTimeout(timeout.current);
				const delay = customDelay !== undefined ? customDelay : defaultDelay;

				setLocalState((prevState) => {
					const [current, upcoming] = prevState;
					const newValue =
						typeof newState === 'function'
							? (newState as (prevState: S, upcomingState: S) => S)(current, upcoming)
							: newState;

					if (!delay || newValue === current) {
						// Instant update!
						return newValue === current && newValue === upcoming
							? prevState
							: [newValue, newValue];
					}
					// Debounced update!
					timeout.current = setTimeout(() => setLocalState([newValue, newValue]), delay);
					return [current, newValue];
				});
			};
			_setter.cancel = () => {
				_setter((prevState) => prevState, null);
			};
			return _setter;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			// defaultDelay,
		]
	);

	useEffect(
		() => {
			thenState !== undefined && setState(thenState);
			return () => {
				timeout.current && clearTimeout(timeout.current);
			};
		},
		[] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const isTransitioning = currentState !== nextState || undefined;

	return [currentState, setState, nextState, isTransitioning];
};

// ===========================================================================

/** @deprecated Use the `useLaggedState` instead (Will be removed in v0.5) */
export default function useLaggyState<S>(
	initialState: S | (() => S),
	/** Default delay in milliseconds */
	defaultDelay: number,
	/** Sugar! A state that should be automatically transitioned to after mounting */
	thenState?: S | (() => S)
): [
	currentState: S,
	nextState: S,
	setState: (
		newState: S | ((prevState: S, upcomingState: S) => S),
		customDelay?: number | false
	) => void,
	isTransitioning: true | undefined
] {
	const [currentState, setState, nextState, isTransitioning] = useLaggedState(
		initialState,
		defaultDelay,
		thenState
	);
	return [currentState, nextState, setState, isTransitioning];
}
