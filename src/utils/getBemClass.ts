import { Modifiers } from '../types';
import getModifierClass from './getModifierClass';

const getBemClass = (bem: string, modifier: Modifiers, extraClass?: string): string =>
	bem + getModifierClass(bem, modifier) + (extraClass ? ' ' + extraClass : '');

/** @deprecated Instead `import { modifiedClass } from '@hugsmidjan/qj/classUtils';`  (Will be removed in v0.5) */
export default getBemClass;
