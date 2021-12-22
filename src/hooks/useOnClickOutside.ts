import { MutableRefObject, RefObject, useEffect, useMemo } from 'react';

type Ref<E extends HTMLElement> = MutableRefObject<E> | RefObject<E>;

const useOnClickOutside = <E extends HTMLElement>(
	ref: Ref<E> | Array<Ref<E>>,
	handler: (event: globalThis.MouseEvent | globalThis.TouchEvent) => void
) => {
	const refs = Array.isArray(ref) ? ref : [ref];
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const stableRefs = useMemo(() => refs, refs);

	useEffect(() => {
		const listener = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
			const shouldTrigger = !stableRefs.some((r) => {
				const node = r.current;

				if (!node) {
					return false;
				}

				if (node.contains(event.target as Node)) {
					return true;
				}
			});

			if (shouldTrigger) {
				handler(event);
			}
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [handler, stableRefs]);
};

export { useOnClickOutside };
