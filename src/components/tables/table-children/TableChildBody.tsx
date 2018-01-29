import * as React from 'react';
import * as classNames from 'classnames';
import * as _ from 'underscore';
import { ITableHeadingAttribute, IData } from '../Table';
import { getTableChildComponentId } from '../TableUtils';
import { TableChildComponent, TOGGLE_ARROW_CELL_COUNT } from '../TableConstants';
import { TableCollapsibleRowConnected } from '../TableCollapsibleRowConnected';
import { TableRowWrapper } from '../TableRowWrapper';
import { TableHeadingRowConnected } from '../TableHeadingRowConnected';
import { convertUndefinedAndNullToEmptyString } from '../../../utils/FalsyValuesUtils';
import { JSXRenderable } from '../../../utils/JSXUtils';
import { IActionOptions } from '../../actions/Action';

export interface ITableBodyInheritedFromTableProps {
  getActions?: (rowData?: IData) => IActionOptions[];
  headingAttributes: ITableHeadingAttribute[];
  collapsibleFormatter?: (tableRowData: IData) => JSXRenderable;
}

export interface ITableChildBodyProps extends ITableBodyInheritedFromTableProps {
  tableId: string;
  rowData: IData;
  isLoading: boolean;
  onRowClick?: (actions: IActionOptions[]) => void;
}

export const TableChildBody = (props: ITableChildBodyProps): JSX.Element => {
  const headingAndCollapsibleId = `${getTableChildComponentId(props.tableId, TableChildComponent.TABLE_HEADING_ROW)}${props.rowData.id}`;
  const tableHeadingRowContent = props.headingAttributes.map((headingAttribute: ITableHeadingAttribute, xPosition: number) => {
    const { attributeName, attributeFormatter } = headingAttribute;
    const headingRowContent: JSXRenderable = attributeFormatter
      ? attributeFormatter(props.rowData[attributeName], attributeName)
      : convertUndefinedAndNullToEmptyString(props.rowData[attributeName]);

    return (<td key={`cell-${xPosition}`}>
      <div className='wrapper'>{headingRowContent}</div>
    </td>);
  });

  const collapsibleData = props.collapsibleFormatter && props.collapsibleFormatter(props.rowData);
  const collapsibleRow = collapsibleData
    ? (
      <TableCollapsibleRowConnected
        id={headingAndCollapsibleId}
        key={`collapsible-row-${props.rowData.id}`}
        nbColumns={props.headingAttributes.length + TOGGLE_ARROW_CELL_COUNT}>
        {collapsibleData}
      </TableCollapsibleRowConnected>
    )
    : null;

  const tableRowWrapperClasses = classNames({
    'table-body-loading': !!props.isLoading,
  });
  const tableRowClasses = classNames({
    disabled: !!props.rowData.disabled || !_.isUndefined(props.rowData.enabled) && !props.rowData.enabled,
  });

  return (
    <TableRowWrapper className={tableRowWrapperClasses}>
      <TableHeadingRowConnected
        id={headingAndCollapsibleId}
        tableId={props.tableId}
        className={tableRowClasses}
        isCollapsible={!!collapsibleData}
        onClickCallback={() => {
          if (props.onRowClick) {
            props.onRowClick(props.getActions && props.getActions(props.rowData));
          }
        }}
        onDoubleClick={() => {
          const actions = props.getActions
            ? props.getActions(props.rowData)
            : [];
          actions
            .filter(action => action.callOnDoubleClick)
            .forEach(action => action.trigger());
        }}>
        {tableHeadingRowContent}
      </TableHeadingRowConnected>
      {collapsibleRow}
    </TableRowWrapper>
  );
};
