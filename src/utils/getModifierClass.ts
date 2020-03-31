const getModifierClass = (
	bem: string,
	modifier: string | Array<string> | undefined | null | false
): string => {
	if (!modifier || !modifier.length) {
		return '';
	}
	const bemPrefix = ' ' + bem + '--';
	return bemPrefix + (typeof modifier === 'string' ? modifier : modifier.join(bemPrefix));
};

export default getModifierClass;
