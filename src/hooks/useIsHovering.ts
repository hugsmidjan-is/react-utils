import { useCallback, useEffect, useState } from 'react';

export const useIsHovering = (ref: React.RefObject<HTMLElement>) => {
	const [isHovering, setHovering] = useState(false);

	const handleMouseOver = useCallback(() => setHovering(true), []);
	const handleMouseOut = useCallback(() => setHovering(false), []);

	useEffect(() => {
		const node = ref.current;

		if (node) {
			node.addEventListener('mouseover', handleMouseOver);
			node.addEventListener('mouseout', handleMouseOut);

			return () => {
				node.removeEventListener('mouseover', handleMouseOver);
				node.removeEventListener('mouseout', handleMouseOut);
			};
		}
	}, [ref, handleMouseOver, handleMouseOut]);

	return isHovering;
};
