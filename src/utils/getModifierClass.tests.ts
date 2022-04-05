import o from 'ospec';
import getModifierClass from './getModifierClass';

const bem = 'BEM';

o.spec('getModifierClass', () => {
	o('Accepts string modifiers', () => {
		o(getModifierClass(bem, 'hello')).equals(' BEM--hello');
		o(getModifierClass(bem, ['hello', 'world'])).equals(' BEM--hello BEM--world');
	});

	o('Ignores empty/nully values', () => {
		(['', undefined, false, null] as const).forEach((modifier) => {
			o(getModifierClass(bem, modifier)).equals('');
		});
		o(getModifierClass(bem, [null, 'hello', '', 'world', undefined, false])).equals(
			' BEM--hello BEM--world'
		);
	});

	o('Accepts nested arrays', () => {
		o(
			getModifierClass(bem, [
				null,
				['hello'],
				[
					[undefined, 'cruel', false],
					['', undefined, [null, 0, ['world']]],
				],
			])
		).equals(' BEM--hello BEM--cruel BEM--world');
	});

	o('Does NOT trim or otherwise clean up strings', () => {
		o(getModifierClass(bem, ' borked ')).equals(' BEM-- borked ');
		o(getModifierClass(bem, [' borked '])).equals(' BEM-- borked ');
	});
});
