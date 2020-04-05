/** @jsx createElement */
import { createElement, FC } from 'react';
import { useDomid } from './hooks';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

export type CheckboxProps = {
	label: JSX.Element | string;
	wrapperProps?: JSX.IntrinsicElements['div'];
} & BemProps &
	JSX.IntrinsicElements['input'];

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

	return (
		<div {...wrapperProps} className={getBemClass(bem, modifier, className)}>
			<input id={domid} type="checkbox" name="" {...inputProps} />{' '}
			<label className={bem + '__label'} htmlFor={domid}>
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
