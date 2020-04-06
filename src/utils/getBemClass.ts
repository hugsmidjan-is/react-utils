import { BemProps } from '../types';
import getModifierClass from './getModifierClass';

const getBemClass = (
	bem: string,
	modifier: BemProps['modifier'],
	extraClass?: string
): string => bem + getModifierClass(bem, modifier) + (extraClass ? ' ' + extraClass : '');

export default getBemClass;
