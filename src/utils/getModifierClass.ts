import { BemProps } from '../types';

const getModifierClass = (
	/** BEM prefix */
	bem: string,
	modifier: BemProps['modifier']
): string => {
	if (!modifier || !modifier.length) {
		return '';
	}
	const bemPrefix = ' ' + bem + '--';
	return typeof modifier === 'string'
		? bemPrefix + modifier
		: modifier.map((item) => (item ? bemPrefix + item : '')).join('');
};

export default getModifierClass;
