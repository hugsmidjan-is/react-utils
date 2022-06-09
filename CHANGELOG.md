# Change Log

## Upcoming...

- ... <!-- Add new lines here. Version number comes later -->

## 0.4.17

_2022-06-09_

- feat: Add optional `group` prop to `SelectboxOptions` items

## 0.4.16

_2022-05-17_

- fix: `<Selectbox />` ignoring `defaultValue`

## 0.4.15

_2022-04-05_

- feat: `getModifierClass`, `getBemClass` now accept nested modifier arrays
- feat: `BemProps.modifier` now accepts nested modifier arrays

## 0.4.14

_2022-03-22_

- fix: Attempt to Better capture weird `<Selectbox />` edge cases — Where the
  browser (or React) snap value to something unexpected because of mismatching
  value and/or options.

## 0.4.12 — 0.4.13

_2022-03-21_

- feat: Add prop `selectRef` to `SelectboxProps`
- feat: Add prop `placeholderDisabled` to `Selectbox`
- feat(ts): Rename `ModalProps` (deprecate the old `Props` type)
- fix: `Selectbox` treating `0` as empty/nully value
- fix: `SelectboxProps.visibleFormat` should skip over empty/invisible labels
- fix: `SelectboxOption.disabled` was ignored
- fix: Relax typing of props.children, allow nullable `ReactNode`s — even when
  children are required

## 0.4.10 — 0.4.11

_2022-03-18_

- fix: Regression in `Selectbox` — externally sourced `value` changes failed

## 0.4.9

_2022-03-09_

- fix: Handling of `defaultValue` by `Selectbox` was badly broken

## 0.4.7 – 0.4.8

_2022-03-08_

- feat: Add prop `fickle` to `Modal` (default: `true`)
- feat: Expand `BemPropsModifier` props to tolerate `0` as falsy value
- fix: Handle better when `Modal`'s `open` and `startOpen` props conflict

## 0.4.6

_2021-12-27_

- feat: add `useOnClickOutside` hook
- feat: add `useIsHovering` hook

## 0.4.5

_2021-10-28_

- fix: Regression in `useCallbackOnEsc` hook

## 0.4.4

_2021-07-09_

- docs: Add JSDoc for `hooks`'s `useShortState`
- chore: De-alias `qj` dependency to prevent downstream issues

## 0.4.3

_2020-11-27_

- fix(ts): Make flag `TableWrapper`'s `wreapperRef` prop optional

## 0.4.2

_2020-11-24_

- feat: Add `utils/mergeRef` helper
- feat: Add prop `wrapperRef` to `TableWrapper`
- `useLaggyState` changes:
  - feat: Allow setting `customDelay` to `false` to emulate `useState()`
  - fix: Only set initial `thenState` once

## 0.4.0 – 0.4.1

_2020-11-11_

- **BREAKING** feat: Make `useOnUnmount` always run the latest passed callback
- **BREAKING** feat: Make `useOnUpdate` always run the latest passed callback
- **BREAKING** feat: Remove `useCallbackOnEsc`'s `deps` array — always run the
  latest passed callback
- feat: Extend `useLaggyState` to accept `thenState` as third parameter
- feat(ts): Export `Modifier` type from `types`

## 0.3.7

_2020-09-14_

- feat: Add `render` prop to `Modal` providing a `closeModal` dispatcher
- feat: Add `aria-controls` prop on `CarouselStepper` and `CarouselPaging`
- feat: Set `title` attr on `CarouselStepper` and `CarouselPaging` buttons

## 0.3.6

_2020-08-18_

- fix: Handle firing `Selectbox`'s `onSelected` on (undefined) placeholders

## 0.3.2 – 0.3.5

_2020-06-02_

- feat: Add `protal` boolean props to `Modal` component
- fix: `Modal`'s open/close change handling was broken
- fix: Skip `Modal`'s initial `onOpen` event if `startOpen === true`
- fix: Allow 0ms customDelay in `useLaggyState()`

## 0.3.0 – 0.3.1

_2020-05-29_

- **BREAKING** feat: Rename package to `@hugsmidjan/react`
- **BREAKING** feat: Refactor and enhance `.Selectbox`
  - Always set `position: relative` on the wrapper element
  - Accept string values for number-type options
  - Add optional `ssr` prop to control rendering mode.
  - Remove `emptyOption` in favour of `placeholder` string
  - Add `onSelected(value, option)` callback prop
- **BREAKING** feat: Make `useCallbackOnEsc` accept `deps` array — and run on
  every render by default (instead of only "on mount")
- feat: Add `onOpen` and `onClose` callback props to `Modal`
- feat: `useClientState`, `useIsServerSide` and `useIsBrowserSide` accept
  `ssrSupport` flag – of type `boolean | 'ssr-only'`. Passing `false` opts
  out, while `ssr-only` always reports as server.
- feat: Add `utils/getBemClass(bem, modifier, extraClass)` helper
- feat: Allow `null` and `false` as `getModifierClass()` modifier values
- feat: Allow passing optional `staticId` to `useDomid()`
- feat: Export type `BemProps` and `BemPropsModifier` from `/types`
- feat: `TableWrapper` now accepts a `bem` prop

## 0.2.5

_2020-02-18_

- fix: Make `getModifierClass()` a default export of its module

## 0.2.4

_2020-02-10_

- feat: Add optional `requiredNote` prop to `FormField`

## 0.2.3

_2020-01-14_

- fix: Apply array of class-modifiers to <Modal> wrapper

## 0.2.2

_2019-12-10_

- feat: Add `errorMessage` prop to `FormField`
- feat: Make all `modifier` props also accept array of strings
- feat: Add simple `Button` component

## 0.2.1

_2019-11-29_

- fix: Correct import filename casing (Curses VSCode!)

## 0.2.0

_2019-11-28_

- **BREAKING** feat: Always call `hooks/useScrollEdgeDetect`'s `getElm` even
  w/o refElm
- **BREAKING** feat: Rename `TableWrapper`'s `modifier` prop
- feat: Make `hooks/useScrollEdgeDetect` react to window resize events
- feat: Add `FormField`, `Selectbox` and `Checkbox` components
- feat: Support custom `key` property on `TableRow` objects, for caching
- feat: Make `Table` skip empty thead and tfoot sections and relax the types
- feat(ts): Export types `TableCellData` & `TableCellMeta`
- feat(ts): Add `PropsOf<ComponentType>` utility type
- fix: `Table`'s cell-level settings should override "cols" meta data

## 0.1.4 – 0.1.9

_2019-11-18_

- feat: Add `hooks/useShortState` and `hooks/useLaggyState` components
- feat: Add `CarouselPaging` and `CarouselStepper` components
- feat: Add `Modal` and `Portal` components
- feat: Add `useOnUnmount` and `useConst`
- feat: Add all props to `Table`'s exported `TableProps`

## 0.1.3

_2019-11-06_

- feat: Add `InlineJavaScript` component
- feat: Update dependencies

## 0.1.0 – 0.1.2

_2019-10-21_

- feat: Add `Table` and `TableWrapper` and `hooks/useScrollEdgeDetect`
- feat: Add basic `hooks`
- chore: Initial scaffolding
