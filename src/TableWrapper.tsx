/** @jsx createElement */
import { createElement, FC } from 'react';

import { useIsBrowserSide } from './hooks';
import useScrollEdgeDetect, {
	ScrollEdgeDetectOptions,
} from './hooks/useScrollEdgeDetect';

const scrollOptions: ScrollEdgeDetectOptions = {
	axis: 'horizontal',
	getElm: (refElm) => {
		const { firstElementChild } = refElm || {};
		return firstElementChild && firstElementChild.nodeName === 'DIV' && firstElementChild;
	},
};

interface P {
	modifier?: string;
}

const TableWrapper: FC<P> = ({ children, modifier }) => {
	const isBrowser = useIsBrowserSide();
	const [scrollerRef, scrollAt] = useScrollEdgeDetect<HTMLDivElement>(scrollOptions);

	const modifierClass = modifier ? ' TableWrapper--' + modifier : '';
	const activeClass = isBrowser ? ' TableWrapper--at' : '';
	const atStartClass = isBrowser && scrollAt.start ? ' TableWrapper--at--start' : '';
	const atEndClass = isBrowser && scrollAt.end ? ' TableWrapper--at--end' : '';

	return (
		<div
			className={'TableWrapper' + modifierClass + activeClass + atStartClass + atEndClass}
			ref={scrollerRef}
		>
			{isBrowser ? <div className="TableWrapper__scroller">{children}</div> : children}
		</div>
	);
};

export default TableWrapper;
