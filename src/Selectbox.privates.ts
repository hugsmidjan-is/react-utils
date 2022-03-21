import { ReactNode } from 'react';
import { SelectboxOption } from './Selectbox';

// ---------------------------------------------------------------------------

export type OptionOrValue = string | number | SelectboxOption;

// ---------------------------------------------------------------------------

const getSelectedOption = <O extends OptionOrValue>(
	options: ReadonlyArray<O>,
	value: (O extends SelectboxOption ? O['value'] : O) | string | number | undefined
): O | undefined => {
	if (value != null) {
		const strValue = String(value);
		return options.find(
			(opt: OptionOrValue) =>
				String(typeof opt === 'object' ? opt.value : opt) === strValue
		);
	}
};

// ---------------------------------------------------------------------------

export const getOptionLabel = <V extends string | number>(
	opt: SelectboxOption<V>
): string => (opt.label != null ? opt.label : String(opt.value));

// ---------------------------------------------------------------------------

export const EMPTY_LABEL = '     ';

export const getVisibleLabel = <O extends OptionOrValue | string>(
	options: ReadonlyArray<O>,
	value: (O extends SelectboxOption ? O['value'] : O) | string | number | undefined,
	placeholder?: string,
	labelFormatter?: (selected: O) => NonNullable<ReactNode>
): ReactNode => {
	const selOption =
		(value == null || value === '') && placeholder != null
			? false
			: getSelectedOption(options, value) ?? (placeholder == null && options[0]);
	let visibleLabel: ReactNode;
	if (selOption !== false && selOption != null) {
		let optionLabel =
			typeof selOption === 'object'
				? getOptionLabel(selOption as SelectboxOption)
				: String(selOption);
		optionLabel = optionLabel.trimRight();

		visibleLabel =
			labelFormatter && optionLabel ? labelFormatter(selOption) : optionLabel;
	}

	return (visibleLabel != null ? visibleLabel : placeholder) || EMPTY_LABEL;
};
