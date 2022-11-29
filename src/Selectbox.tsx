/** @jsx createElement */
import {
	createElement,
	useState,
	useMemo,
	CSSProperties,
	ReactNode,
	ReactElement,
	useRef,
	RefObject,
	useEffect,
} from 'react';
import getModifierClass from './utils/getModifierClass';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';
import { useIsBrowserSide } from './hooks';
import { OptionOrValue, getVisibleLabel, getOptionLabel } from './Selectbox.privates';

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

export interface SelectboxOption<V extends string | number = string | number> {
	value: V;
	label?: string;
	group?: string;
	disabled?: boolean;
}
export type SelectboxOptions<V extends string | number = string | number> = Array<
	SelectboxOption<V>
>;

type OptGroup<V extends string | number = string | number> = {
	title: string;
	options: SelectboxOptions<V>;
};

// ---------------------------------------------------------------------------

export type SelectboxProps<
	O extends OptionOrValue = OptionOrValue,
	V = O extends SelectboxOption ? O['value'] : O
> = {
	/** Class-name for the <span> wrapper around the <select> */
	className?: string;
	options: ReadonlyArray<O>;
	value?: string | V;
	defaultValue?: string | V;
	/** Generates a <option value="" /> at the start of the select's option list */
	placeholder?: string;
	placeholderDisabled?: boolean;
	/**
	 * Sugar alternative to `onChange`.
	 *
	 * If placeholder option was selected, then `value === undefined`
	 */
	onSelected?: (value: V, option: O) => void;
	ssr?: boolean | 'ssr-only';
	/**
	 * Custom visual label formatter.
	 *
	 * NOTE: The formatter is only called for non-empty labels
	 * in order to make a `<Selectbox/>`'s "visibly empty" status more predictably
	 * inferrable by reading `selectRef.current?.selectedOptions[0].textContent`
	 */
	visibleFormat?: (selected: O) => NonNullable<ReactNode>;
	/** Ref object that points to the native <select/> element */
	selectRef?: RefObject<HTMLSelectElement>;
	/** Disables all options except the currently selected one. */
	readOnly?: boolean;
} & BemProps &
	Omit<
		JSX.IntrinsicElements['select'],
		'value' | 'defaultValue' | 'multiple' | 'className'
	>;
/* * /
	// NOTE: This **should** work but for some reason it doesn't
	// As soon as I skip the optional `placeholder` prop
	// (making it implicitly undefined) TS immediately stops recognizing
	// `onSelected` and decides it must be `(any) => any`
	& (
		| {
				placeholder?: undefined;
				onSelected?: (value: V, option: O) => void;
		  }
		| {
				placeholder: string;
				onSelected?: (value?: V, option?: O) => void;
		  });

const _Testing_ = () => (
	<>
		<Selectbox
			options={[1, 2, 3]}
			placeholder={undefined}
			onSelected={(value, option) => {}}
		/>
		<Selectbox
			options={[1, 2, 3]}
			placeholder="Pick one"
			onSelected={(value, option) => {}}
		/>
		// This fails!
		<Selectbox
			options={[1, 2, 3]}
			onSelected={(value, option) => {}}
		/>
	</>
);
/**/

// ---------------------------------------------------------------------------

/** Sugar wrapper for standard `<select/>` elements offering more fancy styling */
const Selectbox = <O extends OptionOrValue>(props: SelectboxProps<O>): ReactElement => {
	const [focused, setFocused] = useState(false);
	const _selectRef = useRef<HTMLSelectElement>(null);

	const {
		className,
		bem = 'Selectbox',
		modifier,
		value,
		defaultValue,
		options,
		visibleFormat,
		ssr,
		onSelected,
		onChange,
		placeholder,
		readOnly,
		selectRef = _selectRef,
		...selectProps
	} = props;

	const isBrowser = useIsBrowserSide(ssr);

	const [currVal, setCurrVal] = useState(() => (value != null ? value : defaultValue));

	type Value = O extends SelectboxOption ? O['value'] : O;
	const { optionsNorm, groupedOptions } = useMemo(() => {
		const optionsNorm = options.map(
			(item: OptionOrValue) =>
				(typeof item === 'string' || typeof item === 'number'
					? { value: item }
					: { ...item }) as SelectboxOption<Value>
		);
		if (readOnly) {
			let found = false;
			const currValStr = currVal + '';
			optionsNorm.forEach((option) => {
				if (found || String(option.value) !== currValStr) {
					option.disabled = true;
					found = true;
				}
			});
		}

		const groupedOptions = optionsNorm.reduce((list, opt, i) => {
			if (!opt.group) {
				list.push(opt);
				return list;
			}
			const lastItem = list[list.length - 1];
			const currGroup = lastItem && 'title' in lastItem ? lastItem : undefined;
			if (currGroup && currGroup.title === opt.group) {
				currGroup.options.push(opt);
			} else {
				list.push({
					title: opt.group,
					options: [opt],
				});
			}
			return list;
		}, [] as Array<SelectboxOption<Value> | OptGroup<Value>>);
		return { optionsNorm, groupedOptions };
	}, [options, currVal, readOnly]);

	// TODO: DECIDE: Handle value="" and options array that doesn't include that value. What to do???
	// Should we auto-generate option and push it to the bottom of the list?

	const selectedOptionText = useMemo(
		() => getVisibleLabel(options, currVal, placeholder, visibleFormat),
		[currVal, options, placeholder, visibleFormat]
	);

	const hasPlaceholder = placeholder != null;
	useEffect(
		() => {
			// capture if browser (or React's <select> handling) auto-selected something
			// unexpected becasue of disabled first option...
			// or if the value and options don't match up, then set currVal to something
			// that's actually available.
			// NOTE: When setCurrVal() sets a value that's the same as the current currVal
			// then no re-redering occurs.
			if (value == null) {
				selectRef.current && setCurrVal(selectRef.current.value);
				return;
			}
			if (value === '' && hasPlaceholder) {
				setCurrVal('');
				return;
			}
			if (optionsNorm.find((o) => o.value === value)) {
				setCurrVal(value);
				return;
			}
			if (hasPlaceholder) {
				setCurrVal('');
				return;
			}
			setCurrVal(optionsNorm[0]?.value ?? '');
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[value, optionsNorm, hasPlaceholder]
	);

	const selectElmClass = isBrowser
		? undefined
		: bem
		? getBemClass(bem, modifier, className)
		: className;

	const renderOption = (opt: SelectboxOption<Value>, key: number) => (
		<option key={key} value={opt.value != null ? opt.value : ''} disabled={opt.disabled}>
			{getOptionLabel(opt).trimRight()}
		</option>
	);

	const selectElement = (
		<select
			ref={selectRef}
			className={selectElmClass}
			{...selectProps}
			onFocus={(e) => {
				props.onFocus?.(e);
				setFocused(true);
			}}
			onBlur={(e) => {
				props.onBlur?.(e);
				setFocused(false);
			}}
			value={currVal}
			style={isBrowser && hiddenSelectStyles}
			data-fancy={isBrowser && ''}
			// data-value={value} // idea?
			onChange={(e) => {
				const idx = e.currentTarget.selectedIndex - (placeholder != null ? 1 : 0);
				setCurrVal(optionsNorm[idx].value);
				onChange && onChange(e);
				if (onSelected) {
					onSelected(optionsNorm[idx].value, options[idx]);
				}
			}}
		>
			{placeholder != null && (
				<option value="" disabled={props.placeholderDisabled}>
					{placeholder}
				</option>
			)}

			{groupedOptions.map((item, i) =>
				'title' in item ? (
					<optgroup label={item.title} key={i}>
						{item.options.map(renderOption)}
					</optgroup>
				) : (
					renderOption(item, i)
				)
			)}
		</select>
	);

	if (isBrowser) {
		return (
			<span
				className={
					getBemClass(bem, modifier, className) +
					getModifierClass(bem, [focused && 'focused', props.disabled && 'disabled'])
				}
				style={{ position: 'relative' }}
			>
				<span
					className={getBemClass(bem + '__value', !currVal && currVal !== 0 && 'empty')}
				>
					{selectedOptionText}
				</span>
				{selectElement}
			</span>
		);
	}
	return selectElement;
};

export default Selectbox;
