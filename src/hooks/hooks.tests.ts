import o from 'ospec';

import { DEFAULT_SSR_SUPPORT, setDefaultSSR, SSRSupport } from './hooks';

const defaultSSRSupport = DEFAULT_SSR_SUPPORT; // Store initial default link for later comparison

const val1: SSRSupport = false;
const val2: SSRSupport = 'ssr-only';
const val3: SSRSupport = true;

o.spec('setDefaultSSR', () => {
	o('push', () => {
		o(DEFAULT_SSR_SUPPORT).equals(defaultSSRSupport)('defaultSSRSupport');
		o(setDefaultSSR(val1)).equals(undefined)('push returns undefined');
		o(DEFAULT_SSR_SUPPORT).equals(val1)('val1');
		setDefaultSSR(val2);
		o(DEFAULT_SSR_SUPPORT).equals(val2)('val2');
		setDefaultSSR(val3);
		o(DEFAULT_SSR_SUPPORT).equals(val3)('val3');
	});
	o('pop', () => {
		o(DEFAULT_SSR_SUPPORT).equals(val3)('Link3 state is retained between tests');
		o(setDefaultSSR.pop()).equals(undefined)('pop returns undefined');
		o(DEFAULT_SSR_SUPPORT).equals(val2)('Link2');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(val1)('Link1');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(defaultSSRSupport)('defaultSSRSupport');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(defaultSSRSupport)('overpopping is harmless');
		setDefaultSSR(val2);
		o(DEFAULT_SSR_SUPPORT).equals(val2)('overpopping has no effect on next push');
	});
	o('repeat pushes', () => {
		setDefaultSSR(val3);
		setDefaultSSR(val3);
		setDefaultSSR(val3);
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(val3)('1st pop');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(val3)('2st pop');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(val2)('3st pop (back to start)');
	});
	o('seting default pushes to the stack', () => {
		setDefaultSSR(undefined);
		setDefaultSSR(undefined);
		o(DEFAULT_SSR_SUPPORT).equals(defaultSSRSupport)('defaultSSRSupport');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(defaultSSRSupport)('2nd pop');
		setDefaultSSR.pop();
		o(DEFAULT_SSR_SUPPORT).equals(val2)('3rd pop (back to start)');
	});
});
