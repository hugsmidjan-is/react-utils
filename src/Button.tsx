/** @jsx createElement */
import { createElement, FC } from 'react';
import getModifierClass from './utils/getModifierClass';
import { BemProps } from './types';

type ButtonElmProps = JSX.IntrinsicElements['button'];

type P = {
	primary?: boolean;
} & BemProps &
	ButtonElmProps;

const Button: FC<P> = (props) => {
	const { bem = 'Button', primary, modifier, className, ...buttonProps } = props;
	const _className = className ? className + ' ' : '';
	const primaryClass = primary ? ' ' + bem + '--primary' : '';

	return (
		<button
			className={_className + bem + primaryClass + getModifierClass(bem, modifier)}
			type="button"
			{...buttonProps}
		/>
	);
};

export default Button;
