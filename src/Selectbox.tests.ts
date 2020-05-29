import o from 'ospec';
import { getOptionLabel, getVisibleLabel, EMPTY_LABEL } from './Selectbox.privates';

o.spec('getOptionLabel', () => {
	o('works', () => {
		o(getOptionLabel({ value: 'hi', label: 'hello' })).equals('hello');
		o(getOptionLabel({ value: 'hi' })).equals('hi');
		o(getOptionLabel({ value: 'hi', label: '' })).equals('');
		o(getOptionLabel({ value: 99 })).equals('99');
	});

	o('fails predictably on wonky inputs', () => {
		// @ts-ignore  (@ts-expect-error)
		o(getOptionLabel({ value: undefined })).equals('undefined');
		// @ts-ignore  (@ts-expect-error)
		o(getOptionLabel('hi')).equals('undefined');
		// @ts-ignore  (@ts-expect-error)
		o(getOptionLabel(99)).equals('undefined');
		// @ts-ignore  (@ts-expect-error)
		o(() => getOptionLabel(undefined)).throws(Error);
	});
});

// ===========================================================================

o.spec('getVisibleLabel', () => {
	o('works for string options', () => {
		const opts = ['hello', 'hola'];
		const formatter = (opt: string) => opt.toUpperCase();
		o(getVisibleLabel(opts, undefined)).equals('hello')('defaults to first option');
		o(getVisibleLabel(opts, undefined, 'hi')).equals('hi')(
			'uses placholder when available'
		);
		o(getVisibleLabel(opts, undefined, undefined, formatter)).equals('HELLO')(
			'accepts formatter function'
		);
		o(getVisibleLabel(opts, 'hola', 'hi', formatter)).equals('HOLA')(
			'finds and formats non-first option'
		);
	});

	o('works for number options', () => {
		const opts = [99, 101];
		const formatter = (opt: number) => 'USD' + opt;
		o(getVisibleLabel(opts, undefined)).equals('99')('defaults to first option');
		o(getVisibleLabel(opts, undefined, 'hi')).equals('hi')(
			'uses placholder when available'
		);
		o(getVisibleLabel(opts, undefined, undefined, formatter)).equals('USD99')(
			'accepts formatter function'
		);
		o(getVisibleLabel(opts, 101, 'hi', formatter)).equals('USD101')(
			'finds and formats non-first option'
		);
		o(getVisibleLabel(opts, '101', 'hi')).equals('101')('Accepts values as string');
	});

	o('works for object options', () => {
		const opts = [{ value: 'hello', label: 'Hello' }, { value: 'hola' }];
		const formatter = (opt: typeof opts[number]) => opt.value.toUpperCase();
		o(getVisibleLabel(opts, undefined)).equals('Hello')('defaults to first option');
		o(getVisibleLabel(opts, undefined, 'hi')).equals('hi')(
			'uses placholder when available'
		);
		o(getVisibleLabel(opts, undefined, undefined, formatter)).equals('HELLO')(
			'accepts formatter function'
		);
		o(getVisibleLabel(opts, 'hola', 'hi', formatter)).equals('HOLA')(
			'finds and formats non-first option'
		);
	});

	o('works for number object options', () => {
		const opts = [{ value: 99, label: 'Hello' }, { value: 101 }];
		const formatter = (opt: typeof opts[number]) => 'USD' + opt.value;
		o(getVisibleLabel(opts, undefined)).equals('Hello')('defaults to first option');
		o(getVisibleLabel(opts, undefined, 'hi')).equals('hi')(
			'uses placholder when available'
		);
		o(getVisibleLabel(opts, undefined, undefined, formatter)).equals('USD99')(
			'accepts formatter function'
		);
		o(getVisibleLabel(opts, 101, 'hi', formatter)).equals('USD101')(
			'finds and formats non-first option'
		);
		o(getVisibleLabel(opts, '101', 'hi')).equals('101')('Accepts values as string');
	});

	o('formatter does NOT format placeholder', () => {
		const formatter = (opt: string) => opt.toUpperCase();
		o(getVisibleLabel(['hello'], undefined, 'hi', formatter)).equals('hi')(
			'accepts formatter function'
		);
	});

	o('gracefully handles zero-length option lists', () => {
		o(getVisibleLabel([], undefined)).equals(EMPTY_LABEL);
		o(getVisibleLabel([] as Array<string>, '')).equals(EMPTY_LABEL);
		o(getVisibleLabel([], undefined, 'hi')).equals('hi');
	});

	o('returns pre-defined `EMPTY_LABEL` when appropriate', () => {
		o(getVisibleLabel([''], undefined)).equals(EMPTY_LABEL);
		o(getVisibleLabel(['hello'], undefined, '')).equals(EMPTY_LABEL);
	});

	o('treats non-existent values as empty', () => {
		// @ts-ignore  (@ts-expect-error)
		o(getVisibleLabel(['hello'], 'wat')).equals('hello');
		// @ts-ignore  (@ts-expect-error)
		o(getVisibleLabel(['hello'], 'wat', 'hi')).equals('hi');
		// @ts-ignore  (@ts-expect-error)
		o(getVisibleLabel(['hello'], 'wat', '')).equals(EMPTY_LABEL);
	});
});
