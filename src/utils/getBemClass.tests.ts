import o from 'ospec';
import getBemClass from './getBemClass';

const bem = 'BEM';

o.spec('getBemClass', () => {
	o('works', () => {
		o(getBemClass(bem, undefined)).equals('BEM');
		o(getBemClass(bem, 'hello')).equals('BEM BEM--hello');
		o(getBemClass(bem, ['hello', 'world'])).equals('BEM BEM--hello BEM--world');
		o(getBemClass(bem, 'hello', 'custom')).equals('BEM BEM--hello custom');
		o(getBemClass(bem, null, 'custom')).equals('BEM custom');
	});
});
