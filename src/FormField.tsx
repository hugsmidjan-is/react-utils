/** @jsx createElement */
import { createElement, FC } from 'react';
import { useDomid } from './hooks';
import Selectbox, { SelectboxProps } from './Selectbox';

type TextareaElmProps = JSX.IntrinsicElements['textarea'];
type InputElmProps = JSX.IntrinsicElements['input'];

type BaseProps<Type extends string, InputProps extends object> = {
	type: Type;
	label: string | JSX.Element;
	bem?: string;
	modifier?: string;
	wrapperProps?: JSX.IntrinsicElements['div'];
} & InputProps;

export type FormFieldProps =
	| BaseProps<'text' | 'email' | 'tel' | 'number' | 'date', InputElmProps>
	| BaseProps<'textarea', TextareaElmProps>
	| BaseProps<'select', SelectboxProps>;

const FormField: FC<FormFieldProps> = (props) => {
	const {
		type,
		bem = 'FormField',
		modifier,
		className,
		wrapperProps,
		id,
		label,
		...fieldProps
	} = props;
	const domid = useDomid();

	const modifierClass = modifier ? ' ' + bem + '--' + modifier : '';
	const _className = className ? className + ' ' : '';
	const fieldProps2 = {
		className: bem + '__field',
		id: id || domid,
	};
	return (
		<div {...wrapperProps} className={_className + bem + modifierClass}>
			<label className={bem + '__label'} htmlFor={fieldProps2.id}>
				{label}
			</label>
			{props.type === 'select' ? (
				<Selectbox id={domid} {...(fieldProps as SelectboxProps)} {...fieldProps2} />
			) : props.type === 'textarea' ? (
				<textarea {...(fieldProps as TextareaElmProps)} {...fieldProps2} />
			) : (
				<input type={type} {...(fieldProps as InputElmProps)} {...fieldProps2} />
			)}
		</div>
	);
};

export default FormField;
