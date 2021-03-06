/** @jsx createElement */
import { createElement, FC } from 'react';
import { useDomid } from './hooks';
import Selectbox, { SelectboxProps } from './Selectbox';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

type TextareaElmProps = JSX.IntrinsicElements['textarea'];
type InputElmProps = JSX.IntrinsicElements['input'];

type BaseProps<Type extends string, InputProps extends object> = {
	type: Type;
	label: string | JSX.Element;
	wrapperProps?: JSX.IntrinsicElements['div'];
	errorMessage?: string | JSX.Element;
	requiredNote?: string;
} & BemProps &
	InputProps;

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
		requiredNote,
		id,
		label,
		errorMessage,
		...fieldProps
	} = props;
	const domid = useDomid();

	const isInvalid = fieldProps['aria-invalid'] || !!errorMessage;
	const invalidClass = isInvalid ? ' ' + bem + '--invalid' : '';
	fieldProps['aria-invalid'] = isInvalid;
	if (errorMessage) {
		const decrBy = fieldProps['aria-describedby'] || '';
		fieldProps['aria-describedby'] = (decrBy ? decrBy + ' ' : '') + domid + '_err';
	}

	const fieldProps2 = {
		className: bem + '__field',
		id: id || domid,
	};
	return (
		<div
			{...wrapperProps}
			className={getBemClass(bem, modifier, className) + invalidClass}
		>
			<label className={bem + '__label'} htmlFor={fieldProps2.id}>
				{fieldProps.required && requiredNote && (
					<abbr className={bem + '__label__reqnote'} aria-label={requiredNote}>
						{'* '}
					</abbr>
				)}
				{label}
			</label>
			{props.type === 'select' ? (
				<Selectbox {...(fieldProps as SelectboxProps)} {...fieldProps2} />
			) : props.type === 'textarea' ? (
				<textarea {...(fieldProps as TextareaElmProps)} {...fieldProps2} />
			) : (
				<input type={type} {...(fieldProps as InputElmProps)} {...fieldProps2} />
			)}
			{!!errorMessage && (
				<div className={bem + '__errormessage'} role="alert" id={domid + '_err'}>
					{props.errorMessage}
				</div>
			)}
		</div>
	);
};

export default FormField;
