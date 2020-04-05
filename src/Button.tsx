/** @jsx createElement */
import { createElement, FC } from 'react';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

type ButtonElmProps = JSX.IntrinsicElements['button'];

type P = {
	primary?: boolean;
} & BemProps &
	ButtonElmProps;

const Button: FC<P> = (props) => {
	const { bem = 'Button', primary, modifier, className, ...buttonProps } = props;
	const primaryClass = primary ? ' ' + bem + '--primary' : '';

	return (
		<button
			className={getBemClass(bem, modifier, className) + primaryClass}
			type="button"
			{...buttonProps}
		/>
	);
};

export default Button;
