import { useState, useEffect } from 'react';
import throttle from 'qj/throttle';

export type ScrollAxis = 'horizontal' | 'vertical';
export interface AtState {
	start: boolean;
	end: boolean;
}
export interface ScrollEdgeDetectOptions<RefElm extends HTMLElement = HTMLElement> {
	axis: ScrollAxis;
	/** **NOTE:** Make sure this function is stable to avoid unnecessary re-runs */
	getElm?: (elm: RefElm | null | undefined) => Element | undefined | null | false;
	/** Initial `at` status */
	startAt?: AtState;
}

const tolerance = 5; // px
const throttleMs = 100;

const useScrollEdgeDetect = <RefElm extends HTMLElement = HTMLElement>(
	options: ScrollAxis | ScrollEdgeDetectOptions<RefElm>
) => {
	const opts: ScrollEdgeDetectOptions<RefElm> =
		typeof options === 'string' ? { axis: options } : options;
	const [refElm, setElmRef] = useState<RefElm | null>(null);
	const [at, setAt] = useState(opts.startAt || { start: true, end: true });

	useEffect(() => {
		const elm = opts.getElm ? opts.getElm(refElm) : refElm;
		if (elm instanceof HTMLElement) {
			const checkScroll = throttle(() => {
				let scroll, offsetSize, totalSize;

				if (opts.axis === 'horizontal') {
					scroll = elm.scrollLeft;
					offsetSize = elm.offsetWidth;
					totalSize = elm.scrollWidth;
				} else {
					scroll = elm.scrollTop;
					offsetSize = elm.offsetHeight;
					totalSize = elm.scrollHeight;
				}

				let newAt = at;
				const atStart = scroll < tolerance;
				const atEnd = totalSize - (offsetSize + scroll) < tolerance;
				if (newAt.start !== atStart) {
					newAt = {
						start: atStart,
						end: newAt.end,
					};
				}
				if (newAt.end !== atEnd) {
					newAt = {
						start: newAt.start,
						end: atEnd,
					};
				}
				setAt(newAt);
			}, throttleMs);

			elm.addEventListener('scroll', checkScroll);
			window.addEventListener('resize', checkScroll);
			checkScroll();

			return () => {
				elm.removeEventListener('scroll', checkScroll);
				window.removeEventListener('resize', checkScroll);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refElm, opts.getElm, opts.axis /*, at */]);

	return [setElmRef, at] as const;
};

export default useScrollEdgeDetect;
