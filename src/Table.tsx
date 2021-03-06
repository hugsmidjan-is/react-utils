/** @jsx createElement */
import { createElement, memo, useMemo, FC, ReactNode } from 'react';

export type TableCellMeta = { className?: string } & (
	| { tel?: false; number?: false; text?: false } // catch-all
	| { number: true; tel?: false; text?: false }
	| { tel: true; number?: false; text?: false }
	| { text: true | 'right' | 'center'; number?: false; tel?: false });

export type TableCellData = {
	value: ReactNode | ((rowIdx: number) => ReactNode);
	colSpan?: number;
} & TableCellMeta;

interface RowData {
	cells: Array<TableCellData>;
	key: string | undefined;
}

export type TableCols = Array<TableCellMeta | null>;
export type TableCell = string | TableCellData;
export type TableRow = Array<TableCell> | { cells: Array<TableCell>; key?: string };
export type TableData = {
	caption?: ReactNode;
	thead: Array<TableRow>;
	tfoot?: Array<TableRow>;
} & (
	| {
			tbody: Array<TableRow>;
			tbodies?: undefined;
	  }
	| {
			tbodies: Array<Array<TableRow>>;
			tbody?: undefined;
	  });

// ===========================================================================

interface CellProps {
	data: TableCellData;
	rowIdx: number;
	meta?: TableCellMeta | null;
	th?: boolean;
	rowScope?: boolean;
}

const TableCell: FC<CellProps> = ({ data, meta, th, rowScope, rowIdx }) => {
	const Tag = th ? 'th' : 'td';
	const { className = '', value, colSpan, number, tel, text } = { ...meta, ...data };

	const numberClass = !number
		? ''
		: number === true
		? 'Cell--number'
		: 'Cell--number--' + number;
	const textClass = !text ? '' : text === true ? 'Cell--text' : 'Cell--text--' + text;
	const telClass = tel ? 'Cell--tel' : '';

	let _className = numberClass || telClass || textClass;
	_className += (_className && className ? ' ' : '') && className;

	return (
		<Tag
			className={_className || undefined}
			colSpan={colSpan}
			scope={rowScope ? 'row' : undefined}
		>
			{typeof value === 'function' ? value(rowIdx) : value}
		</Tag>
	);
};

// ===========================================================================

interface SectionProps {
	section: Array<RowData>;
	cols?: TableCols;
	Tag: 'thead' | 'tfoot' | 'tbody';
}
const TableSection: FC<SectionProps> = ({ section, cols = [], Tag }) =>
	section && section.length ? (
		<Tag>
			{section.map(({ key, cells }, rowIdx) => {
				let colIdx = 0;
				return (
					<tr key={key != null ? key : rowIdx}>
						{cells.map((cell, i) => {
							const rowScope = i === 0;
							const meta = cols[colIdx];
							colIdx += cell.colSpan || 1;
							return (
								<TableCell
									key={i}
									th={Tag === 'thead' || rowScope}
									data={cell}
									meta={meta}
									rowIdx={rowIdx}
									rowScope={rowScope}
								/>
							);
						})}
					</tr>
				);
			})}
		</Tag>
	) : null;

// ===========================================================================

const normalizeTableSectData = (rows: Array<TableRow>): Array<RowData> =>
	rows.map((row) => {
		const cells = 'cells' in row ? row.cells : row;
		return {
			cells: cells.map(
				(data): TableCellData => (typeof data === 'string' ? { value: data } : data)
			),
			key: 'key' in row ? row.key : undefined,
		};
	});

interface TableDataNormalized {
	caption?: ReactNode;
	thead: Array<RowData> | null | false;
	tfoot?: Array<RowData> | null | false;
	tbodies: Array<Array<RowData>>;
}

const normalizeTableData = (tableData: TableData): TableDataNormalized => {
	const { caption, thead, tfoot, tbody, tbodies } = tableData;
	return {
		caption,
		thead: normalizeTableSectData(thead),
		tfoot: tfoot && normalizeTableSectData(tfoot),
		tbodies: (tbodies || (tbody ? [tbody] : [])).map(normalizeTableSectData),
	};
};

// ===========================================================================

export type TableProps = TableData & {
	cols?: TableCols;
	className: string;
	children?: undefined;
};

const Table: FC<TableProps> = memo(
	({ className, caption, thead, tfoot, tbody, tbodies, cols }) => {
		const data = useMemo(
			() => normalizeTableData({ caption, thead, tfoot, tbody, tbodies } as TableData),
			[caption, thead, tfoot, tbody, tbodies]
		);
		return (
			<table className={className}>
				{data.caption && <caption>{data.caption}</caption>}
				{data.thead && <TableSection section={data.thead} cols={cols} Tag="thead" />}
				{data.tfoot && <TableSection section={data.tfoot} cols={cols} Tag="tfoot" />}
				{data.tbodies.map((section, i) => (
					<TableSection key={i} section={section} cols={cols} Tag="tbody" />
				))}
			</table>
		);
	}
);

export default Table;
