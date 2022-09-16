import { Component, FC } from 'react';

export type PropsOf<T> = T extends FC<infer P>
	? P
	: T extends Component<infer P>
	? P
	: never;

// ---------------------------------------------------------------------------

type Falsy = undefined | null | false | 0;
export type Modifier = string | Falsy;

export type Modifiers = Modifier | Array<Modifiers>;

export interface BemPropsModifier {
	/** List of CSS BEM --modifier's to add to the component's main wrapper.
	 *
	 * All falsy values are neatly skipped.
	 */
	modifier?: Modifiers;
}
export interface BemProps extends BemPropsModifier {
	/** CSS BEM class-name prefix to be used for this component. Defaults to the same as the original component's displayName */
	bem?: string;
}
