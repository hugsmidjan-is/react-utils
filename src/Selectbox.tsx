/** @jsx createElement */
import {
	createElement,
	useState,
	useMemo,
	CSSProperties,
	ChangeEvent,
	ReactNode,
	ReactElement,
} from 'react';
import { getModifierClass } from './utils/getModifierClass';

const hiddenSelectStyles: CSSProperties = {
	opacity: 0.0001,
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: '100%',
	height: '100%',
	// unset existing styles°
	top: 'auto',
	right: 'auto',
	margin: 0,
	padding: 0,
	border: 0,
};

const emptyValue = '     ';

type SelectElmProps = Omit<
	JSX.IntrinsicElements['select'],
	'value' | 'onChange' | 'className'
>;

export interface SelectboxOption<V extends string | number = string | number> {
	value: V;
	label?: string;
}

// ---------------------------------------------------------------------------

const getSelectedOption = <Option extends SelectboxOption>(
	firstOpt: Option | undefined,
	options: ReadonlyArray<Option>,
	value: string | undefined
) => {
	let selOption;
	if (value != null) {
		selOption =
			firstOpt && String(firstOpt.value) === value
				? firstOpt
				: options.find((opt) => String(opt.value) === value);
	}
	return selOption || firstOpt || options[0];
};

// ---------------------------------------------------------------------------

export type SelectboxProps<
	Option extends SelectboxOption = SelectboxOption,
	EmptyOpt extends string | Option = string | Option,
	RetOption = EmptyOpt extends string ? Option | SelectboxOption<''> : Option
> = {
	/** Class-name for the <span> wrapper around the <select> */
	className?: string;
	bem?: string;
	modifier?: string | Array<string>;
	value?: Option['value'];
	options: ReadonlyArray<Option>;
	emptyOption?: EmptyOpt;
	onChange?: (
		event: ChangeEvent<HTMLSelectElement>,
		value: Option['value'],
		option: RetOption
	) => void;
	visibleFormat?: (selected: RetOption) => ReactNode;
} & SelectElmProps;

// TODO: support placeholder prop as alias for emptyOption

// ---------------------------------------------------------------------------

const Selectbox = <Option extends SelectboxOption>(
	props: SelectboxProps<Option>
): ReactElement => {
	const [focused, setFocused] = useState(false);

	const {
		className,
		bem = 'Selectbox',
		modifier,
		value,
		options,
		visibleFormat,
		onChange,
		emptyOption,
		...forwardingProps
	} = props;

	const firstOpt =
		typeof emptyOption === 'string'
			? ({ value: '', label: emptyOption } as const)
			: emptyOption;

	const selectedOptionText = useMemo(() => {
		const selOption = getSelectedOption(firstOpt, options, String(value));
		const visibleValue = visibleFormat
			? visibleFormat(selOption)
			: selOption.label || String(selOption.value);
		return visibleValue || emptyValue;
	}, [firstOpt, options, value, visibleFormat]);

	const focusedClass = focused ? ' ' + bem + '--focused' : '';
	const disabledClass = props.disabled ? ' ' + bem + '--disabled' : '';
	const classNm = className ? className + ' ' : '';

	const emptyValueClass = !value && value !== 0 ? ' ' + bem + '__value--empty' : '';

	return (
		<span
			className={
				classNm + bem + getModifierClass(bem, modifier) + focusedClass + disabledClass
			}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
		>
			<span className={bem + '__value' + emptyValueClass}>{selectedOptionText}</span>
			<select
				{...forwardingProps}
				value={value != null ? value : ''}
				style={hiddenSelectStyles}
				data-fancy
				// data-value={value}
				onChange={
					onChange &&
					((e) => {
						const option = getSelectedOption(firstOpt, options, e.currentTarget.value);
						return onChange(e, option.value, option);
					})
				}
			>
				{firstOpt && (
					<option value={firstOpt.value || ''}>{firstOpt.label || firstOpt.value}</option>
				)}
				{options.map((option, i) => (
					<option key={i} value={option.value}>
						{option.label || option.value}
					</option>
				))}
			</select>
		</span>
	);
};

export default Selectbox;
