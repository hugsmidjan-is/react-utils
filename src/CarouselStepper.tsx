/** @jsx createElement */
import { createElement, FC } from 'react';

export interface Props {
	current: number;
	itemCount: number;
	setCurrent: (idx: number) => void;
	bem?: string;
	modifier?: string;
	texts?: {
		prefix: string;
	};
}

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
	const modifierClass = modifier ? ' ' + bem + '--' + modifier : '';

	return (
		<div className={bem + modifierClass}>
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
						onClick={() => setCurrent(i)}
						aria-label={label}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
};

export default CarouselStepper;
