/** @jsx createElement */
import { createElement, FC, RefObject } from 'react';

import { useIsBrowserSide } from './hooks';
import useScrollEdgeDetect, {
	ScrollEdgeDetectOptions,
} from './hooks/useScrollEdgeDetect';
import getModifierClass from './utils/getModifierClass';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

const scrollOptions: ScrollEdgeDetectOptions = {
	axis: 'horizontal',
};

type P = BemProps & { wrapperRef: RefObject<HTMLElement> };

const TableWrapper: FC<P> = ({
	children,
	modifier,
	bem = 'TableWrapper',
	wrapperRef,
}) => {
	const isBrowser = useIsBrowserSide();
	const [scrollerRef, scrollAt] = useScrollEdgeDetect<HTMLDivElement>(scrollOptions);

	const scrollClasses = isBrowser
		? getModifierClass(bem, [
				'at',
				scrollAt.start && 'at--start',
				scrollAt.end && 'at--end',
		  ])
		: '';

	return (
		<div
			className={getBemClass(bem, modifier) + scrollClasses}
			ref={wrapperRef as RefObject<HTMLDivElement>}
		>
			{isBrowser ? (
				<div className={bem + '__scroller'} ref={scrollerRef}>
					{children}
				</div>
			) : (
				children
			)}
		</div>
	);
};

export default TableWrapper;
