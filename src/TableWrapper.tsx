/** @jsx createElement */
import { createElement, FC } from 'react';

import { useIsBrowserSide } from './hooks';
import useScrollEdgeDetect, {
	ScrollEdgeDetectOptions,
} from './hooks/useScrollEdgeDetect';
import getModifierClass from './utils/getModifierClass';
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

	const bemPrefix = ' ' + bem + '--';
	const activeClass = isBrowser ? bemPrefix + 'at' : '';
	const atStartClass = isBrowser && scrollAt.start ? bemPrefix + 'at--start' : '';
	const atEndClass = isBrowser && scrollAt.end ? bemPrefix + 'at--end' : '';

	return (
		<div
			className={
				bem + getModifierClass(bem, modifier) + activeClass + atStartClass + atEndClass
			}
			ref={scrollerRef}
		>
			{isBrowser ? <div className={bem + '__scroller'}>{children}</div> : children}
		</div>
	);
};

export default TableWrapper;
