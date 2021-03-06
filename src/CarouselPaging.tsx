/** @jsx createElement */
import { createElement, FC } from 'react';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

export type Props = BemProps & {
	current: number;
	itemCount: number;
	setCurrent: (idx: number) => void;
	'aria-controls'?: string;
	texts?: Readonly<{
		next: string;
		prev: string;
		unit?: string;
	}>;
};

const defaultTexts: Props['texts'] = {
	next: 'Next',
	prev: 'Previous',
};

const CarouselPaging: FC<Props> = (props) => {
	const {
		bem = 'CarouselPaging',
		modifier,
		current,
		itemCount,
		setCurrent,
		texts = defaultTexts,
	} = props;

	const { next, prev, unit = '' } = texts;

	return (
		<div className={getBemClass(bem, modifier)}>
			<button
				className={bem + '__button ' + bem + '__button--next'}
				type="button"
				disabled={current >= itemCount - 1}
				onClick={() => setCurrent(current + 1)}
				aria-controls={props['aria-controls']}
				aria-label={next + ' ' + unit}
				title={next + ' ' + unit}
			>
				{next}
			</button>{' '}
			<button
				className={bem + '__button ' + bem + '__button--prev'}
				type="button"
				disabled={current === 0}
				onClick={() => setCurrent(current - 1)}
				aria-controls={props['aria-controls']}
				aria-label={prev + ' ' + unit}
				title={prev + ' ' + unit}
			>
				{prev}
			</button>
		</div>
	);
};

export default CarouselPaging;
