import { MutableRefObject, RefObject, useEffect } from 'react';

type Ref<E extends HTMLElement> = MutableRefObject<E> | RefObject<E>;

const useOnClickOutside = <E extends HTMLElement>(
	ref: Ref<E> | Array<Ref<E>>,
	handler: (event: globalThis.MouseEvent | globalThis.TouchEvent) => void
) => {
	useEffect(() => {
		const listener = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
			const refs = Array.isArray(ref) ? ref : [ref];

			const shouldTrigger = !refs.some((r) => {
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
		// Assume refs are stable
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handler]);
};

export { useOnClickOutside };
