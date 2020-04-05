import { BemProps } from '../types';
import getModifierClass from './getModifierClass';

const getBemClass = (
	bem: string,
	modifier: BemProps['modifier'],
	extraClass?: string
): string => (extraClass ? extraClass + ' ' : '') + bem + getModifierClass(bem, modifier);

export default getBemClass;
