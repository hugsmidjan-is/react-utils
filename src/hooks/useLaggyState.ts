import { useState, useRef } from 'react';
import { useOnMount, useConst } from './hooks';

const useLaggyState = <S>(initialState: S | (() => S), delay: number) => {
	const [lagging, setLagging] = useState<S>(initialState);
	const [instant, setInstant] = useState<S>(initialState);
	const timeout = useRef<NodeJS.Timeout | null>();

	const cancelTimeout = () => {
		timeout.current && clearTimeout(timeout.current);
	};

	const setState = useConst((newState: S | (() => S), customDelay?: number) => {
		setInstant(newState);
		cancelTimeout();
		timeout.current = setTimeout(() => {
			timeout.current = null;
			setLagging(newState);
		}, customDelay || delay);
	});

	useOnMount(() => {
		return cancelTimeout;
	});

	// This is more reliable than laggingState !== instantState
	const isTransitioning = !!timeout.current || undefined;

	return [lagging, instant, setState, isTransitioning] as const;
};

export default useLaggyState;
