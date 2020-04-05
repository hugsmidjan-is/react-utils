/** @jsx createElement */
import { createElement, FC } from 'react';

import { useIsBrowserSide } from './hooks';
import useScrollEdgeDetect, {
	ScrollEdgeDetectOptions,
} from './hooks/useScrollEdgeDetect';
import getModifierClass from './utils/getModifierClass';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

const scrollOptions: ScrollEdgeDetectOptions = {
	axis: 'horizontal',
	getElm: (refElm) => {
		const { firstElementChild } = refElm || {};
		return firstElementChild && firstElementChild.nodeName === 'DIV' && firstElementChild;
	},
};

type P = BemProps;

const TableWrapper: FC<P> = ({ children, modifier, bem = 'TableWrapper' }) => {
	const isBrowser = useIsBrowserSide();
	const [scrollerRef, scrollAt] = useScrollEdgeDetect<HTMLDivElement>(scrollOptions);

	return (
		<div
			className={
				getBemClass(bem, modifier) +
				getModifierClass(
					bem,
					isBrowser && ['at', scrollAt.start && 'at--start', scrollAt.end && 'at--end']
				)
			}
			ref={scrollerRef}
		>
			{isBrowser ? <div className={bem + '__scroller'}>{children}</div> : children}
		</div>
	);
};

export default TableWrapper;
