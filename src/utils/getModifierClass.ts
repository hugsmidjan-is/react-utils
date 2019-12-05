export const getModifierClass = (
	bem: string,
	modifier: string | Array<string> | undefined
): string => {
	if (!modifier || !modifier.length) {
		return '';
	}
	const bemPrefix = ' ' + bem + '--';
	return bemPrefix + (typeof modifier === 'string' ? modifier : modifier.join(bemPrefix));
};
