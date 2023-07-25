import { Modifiers } from '../types';

const getModifierClass = (
	/** BEM prefix */
	bem: string,
	modifier: Modifiers
): string => {
	const flattenModifiers = (modifier: Modifiers): string =>
		!modifier || !modifier.length
			? ''
			: typeof modifier === 'string'
			? ' ' + bem + '--' + modifier
			: modifier.map(flattenModifiers).join('');

	return flattenModifiers(modifier);
};

/** @deprecated Instead `import { modifiedClass } from '@hugsmidjan/qj/classUtils';`  (Will be removed in v0.5) */
export default getModifierClass;
