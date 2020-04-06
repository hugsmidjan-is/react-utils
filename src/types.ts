import { Component, FC } from 'react';

export type PropsOf<T> = T extends FC<infer P>
	? P
	: T extends Component<infer P>
	? P
	: never;

// ---------------------------------------------------------------------------

type Modifier = string | undefined | null | false;

export interface BemPropsModifier {
	modifier?: Modifier | ReadonlyArray<Modifier>;
}
export interface BemProps extends BemPropsModifier {
	bem?: string;
}
