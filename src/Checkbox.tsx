/** @jsx createElement */
import { createElement, FC } from 'react';
import { useDomid } from './hooks';
import { getModifierClass } from './utils/getModifierClass';

export type CheckboxProps = {
	label: JSX.Element | string;
	bem?: string;
	modifier?: string | Array<string>;
	wrapperProps?: JSX.IntrinsicElements['div'];
} & JSX.IntrinsicElements['input'];

const Checkbox: FC<CheckboxProps> = (props) => {
	const {
		label,
		bem = 'Checkbox',
		modifier,
		wrapperProps,
		className,
		id,
		...inputProps
	} = props;
	let domid = useDomid();
	domid = id || domid;

	const classNm = className ? className + ' ' : '';

	return (
		<div {...wrapperProps} className={classNm + bem + getModifierClass(bem, modifier)}>
			<input id={domid} type="checkbox" name="" {...inputProps} />{' '}
			<label className={bem + '__label'} htmlFor={domid}>
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
