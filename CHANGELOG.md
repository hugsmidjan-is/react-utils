# Change Log

## Upcoming...

- ... <!-- Add new lines here. Version number will be decided later -->

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
