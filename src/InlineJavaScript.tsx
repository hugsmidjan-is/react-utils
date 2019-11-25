/** @jsx createElement */
import { createElement, FC } from 'react';

interface P {
	code: string;
	children?: undefined;
}
const InlineJavaScript: FC<P> = ({ code }) => (
	<script dangerouslySetInnerHTML={{ __html: code }} />
);

export default InlineJavaScript;
