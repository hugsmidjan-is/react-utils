import { Component, FC } from 'react';

export type PropsOf<T> = T extends FC<infer P>
	? P
	: T extends Component<infer P>
	? P
	: never;

// ---------------------------------------------------------------------------

export type Modifier = string | undefined | null | false;

export interface BemPropsModifier {
	/** List of CSS BEM --modifier's to add to the component's main wrapper.
	 *
	 * All falsy values are neatly skipped.
	 */
	modifier?: Modifier | ReadonlyArray<Modifier>;
}
export interface BemProps extends BemPropsModifier {
	/** CSS BEM class-name prefix to be used for this component. Defaults to the same as the original component's displayName */
	bem?: string;
}

export type InferTypeFromArray<A> = A extends Array<infer Data> ? Data : never;

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};

export type Nullable<T> = T | null;

export type Maybe<T> = Nullable<T> | undefined;

export type SparseArray<V> = Array<V | undefined>;

export type SaneRecord<K extends string | number | symbol, V> = string extends K
	? Record<K, V | undefined>
	: number extends K
	? Record<K, V | undefined>
	: symbol extends K
	? Record<K, V | undefined>
	: Record<K, V>;

export type ExcludesFalse = <T>(x: T | null | undefined | false) => x is T;
