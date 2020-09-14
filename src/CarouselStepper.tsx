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
		prefix: string;
	}>;
};

const defaultTexts = {
	prefix: '',
};

const array = new Array(25).join(' ').split('');

const CarouselStepper: FC<Props> = (props) => {
	const {
		bem = 'CarouselStepper',
		modifier,
		current,
		itemCount,
		setCurrent,
		texts = defaultTexts,
	} = props;

	const labelPrefix = texts.prefix ? texts.prefix + ' ' : '';

	return (
		<div className={getBemClass(bem, modifier)}>
			{array.slice(0, itemCount).map((_, i) => {
				const isCurrent = current === i || undefined;
				const label = labelPrefix + (i + 1);
				return (
					<button
						key={i}
						className={bem + '__button'}
						type="button"
						disabled={isCurrent}
						aria-pressed={isCurrent}
						aria-controls={props['aria-controls']}
						onClick={() => setCurrent(i)}
						aria-label={label}
						title={label}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
};

export default CarouselStepper;
