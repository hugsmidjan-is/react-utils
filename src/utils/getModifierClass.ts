import { BemProps, Modifiers } from '../types';

const getModifierClass = (
	/** BEM prefix */
	bem: string,
	modifier: BemProps['modifier']
): string => {
	const flattenModifiers = (modifier: Modifiers): string =>
		!modifier || !modifier.length
			? ''
			: typeof modifier === 'string'
			? ' ' + bem + '--' + modifier
			: modifier.map(flattenModifiers).join('');

	return flattenModifiers(modifier);
};

export default getModifierClass;
