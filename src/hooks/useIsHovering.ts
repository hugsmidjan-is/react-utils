import { useEffect, useState } from 'react';

/**
 *
 * @param ref ref to check for hovering state
 * @returns boolean indicating if the ref is being hovered
 */
export const useIsHovering = (ref: React.RefObject<HTMLElement>) => {
	const [isHovering, setHovering] = useState(false);

	useEffect(() => {
		const node = ref.current;

		if (node) {
			const handleMouseOver = () => setHovering(true);
			const handleMouseOut = () => setHovering(false);
			node.addEventListener('mouseover', handleMouseOver);
			node.addEventListener('mouseout', handleMouseOut);

			return () => {
				node.removeEventListener('mouseover', handleMouseOver);
				node.removeEventListener('mouseout', handleMouseOut);
			};
		}
	}, [ref]);

	return isHovering;
};
