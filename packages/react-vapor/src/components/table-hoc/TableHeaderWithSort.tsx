import classNames from 'classnames';
import * as React from 'react';
import * as _ from 'underscore';
import {IReactVaporState} from '../../ReactVapor';
import {IDispatch, ReduxConnect} from '../../utils/ReduxUtils';
import {TextLoadingPlaceholder} from '../loading/components/TextLoadingPlaceholder';
import {Svg} from '../svg/Svg';
import {TableHeaderActions} from './actions/TableHeaderActions';
import {ITableWithSortState} from './reducers/TableWithSortReducers';

export interface ITableHeaderWithSortOwnProps {
    id: string;
    tableId: string;
    isLoading?: boolean;
    isDefault?: boolean;
}

export interface HOCTableHeaderStateProps {
    sorted: boolean;
}

export interface ITableHeaderWithSortDispatchProps {
    onMount: () => void;
    onSort: () => void;
    onUnmount: () => void;
}

export interface ITableHeaderWithSortProps
    extends ITableHeaderWithSortOwnProps,
        Partial<HOCTableHeaderStateProps>,
        Partial<ITableHeaderWithSortDispatchProps> {}

const mapStateToProps = (state: IReactVaporState, ownProps: ITableHeaderWithSortOwnProps) => {
    const tableSort: ITableWithSortState = _.findWhere(state.tableHOCHeader, {id: ownProps.id});

    return {
        sorted: tableSort && tableSort.isAsc,
    };
};

const mapDispatchToProps = (
    dispatch: IDispatch,
    ownProps: ITableHeaderWithSortOwnProps
): ITableHeaderWithSortDispatchProps => ({
    onMount: () => dispatch(TableHeaderActions.addTableHeader(ownProps.id, ownProps.tableId, ownProps.isDefault)),
    onSort: () => dispatch(TableHeaderActions.sortTable(ownProps.id)),
    onUnmount: () => dispatch(TableHeaderActions.removeTableHeader(ownProps.id)),
});

@ReduxConnect(mapStateToProps, mapDispatchToProps)
export class TableHeaderWithSort extends React.Component<
    ITableHeaderWithSortProps & React.HTMLAttributes<HTMLTableHeaderCellElement>
> {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const headerCellClasses = classNames(this.props.className, 'admin-sort', {
            'admin-sort-ascending': this.props.sorted === true,
            'admin-sort-descending': this.props.sorted === false,
        });

        if (this.props.isLoading) {
            return (
                <th id={this.props.id}>
                    <TextLoadingPlaceholder small />
                </th>
            );
        }

        return (
            <th id={this.props.id} className={headerCellClasses} onClick={() => this.props.onSort()}>
                {this.props.children}
                <div className="admin-sort-icon">
                    <Svg svgName="asc-desc" className="tables-sort icon" />
                </div>
            </th>
        );
    }
}
