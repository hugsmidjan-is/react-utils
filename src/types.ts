import { Component, FC } from 'react';

export type PropsOf<T> = T extends FC<infer P>
	? P
	: T extends Component<infer P>
	? P
	: never;

export interface BemProps {
	bem?: string;
	modifier?: string | ReadonlyArray<string>;
}
