import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'underscore';
import {IReactVaporState} from '../../ReactVapor';
import {keyCode} from '../../utils/InputUtils';
import {IDispatch, ReduxConnect} from '../../utils/ReduxUtils';
import {IItemBoxProps} from '../itemBox/ItemBox';
import {ListBoxConnected} from '../listBox/ListBoxConnected';
import {addAutocomplete, removeAutocomplete, setAutocompleteActive, setAutocompleteValue, toggleAutocomplete} from './AutocompleteActions';
import {IAutocompleteState} from './AutocompleteReducers';

const defaultMatchFilter = (filterValue: string, item: IItemBoxProps) => {
    if (filterValue === '') {
        return true;
    }

    const regex = new RegExp(filterValue, 'gi');
    return regex.test(item.value) || regex.test(item.displayValue);
};

export interface IAutocompleteOwnProps {
    id: string;
    items: IItemBoxProps[];
    matchFilter?: (filterValue: string, item: IItemBoxProps) => boolean;
}

export interface IAutocompleteStateProps {
    isOpen?: boolean;
    value?: string;
    visibleItems?: IItemBoxProps[];
    active?: number;
}

export interface IAutocompleteDispatchProps {
    onRender?: () => void;
    onDestroy?: () => void;
    onDocumentClick?: () => void;
    onFocus?: () => void;
    onChange?: (value: string) => void;
    setActive?: (diff: number) => void;
}

export interface IAutocompleteProps extends IAutocompleteOwnProps, IAutocompleteStateProps, IAutocompleteDispatchProps {}

const mapStateToProps = (state: IReactVaporState, ownProps: IAutocompleteOwnProps): IAutocompleteStateProps => {
    const autocomplete: IAutocompleteState = _.findWhere(state.autocompletes, {id: ownProps.id});
    const listbox = _.findWhere(state.listBoxes, {id: ownProps.id});
    const defaultValue = listbox && listbox.selected && listbox.selected.length ? listbox.selected[0] : '';
    const value = autocomplete && autocomplete.value || defaultValue;

    const itemsWithHidden = _.map(ownProps.items, (item: IItemBoxProps): IItemBoxProps => {
        const visible = _.isUndefined(ownProps.matchFilter)
            ? defaultMatchFilter(value, item)
            : ownProps.matchFilter(value, item);

        return {...item, hidden: !visible || !!item.hidden};
    });

    let index = 0;
    const activeIndex = autocomplete && autocomplete.active;
    const visibleLength = _.filter(itemsWithHidden, (item: IItemBoxProps) => !item.hidden && !item.disabled).length;
    const mod = (x: number, n: number) => (x % n + n) % n; // mod is a modulo function that works with negative numbers
    const visibleItems = _.map(itemsWithHidden, (item: IItemBoxProps): IItemBoxProps => {
        let active = false;
        if (!item.hidden && !item.disabled) {
            active = mod(activeIndex, visibleLength) === index;
            index++;
        }
        return {...item, active};
    });

    return {
        visibleItems,
        active: autocomplete && autocomplete.active,
        isOpen: autocomplete && autocomplete.open,
        value: autocomplete && autocomplete.value || defaultValue,
    };
};

const mapDispatchToProps = (dispatch: IDispatch, ownProps: IAutocompleteOwnProps): IAutocompleteDispatchProps => ({
    onRender: () => dispatch(addAutocomplete(ownProps.id)),
    onDestroy: () => dispatch(removeAutocomplete(ownProps.id)),
    onDocumentClick: () => dispatch(toggleAutocomplete(ownProps.id, false)),
    onFocus: () => dispatch(toggleAutocomplete(ownProps.id)),
    onChange: (value: string) => dispatch(setAutocompleteValue(ownProps.id, value)),
    setActive: (diff: number) => dispatch(setAutocompleteActive(ownProps.id, diff)),
});

@ReduxConnect(mapStateToProps, mapDispatchToProps)
export class AutocompleteConnected extends React.Component<IAutocompleteProps, {}> {
    private dropdown: HTMLDivElement;
    private menu: HTMLDivElement;

    componentWillMount() {
        this.props.onRender();
        document.addEventListener('mousedown', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleDocumentClick);
        this.props.onDestroy();
    }

    render() {
        const pickerClasses = classNames('autocomplete', {open: this.props.isOpen});
        const dropdownClasses = classNames('autocomplete-list-container bg-pure-white', {hidden: !this.props.isOpen});
        return (
            <div className={pickerClasses} ref={(ref: HTMLDivElement) => this.dropdown = ref}>
                <div className='input-wrapper validate input-field'>
                    <input
                        onFocus={() => this.props.onFocus()}
                        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => this.onKeyUp(e)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.onKeyDown(e)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.onChange(e.target.value)}
                        value={this.props.value}
                        required
                    />
                    {this.props.children}
                </div>
                <div className={dropdownClasses} ref={(ref: HTMLDivElement) => this.menu = ref}>
                    <ListBoxConnected id={this.props.id} classes={['relative']} items={this.props.visibleItems} highlight={this.props.value} />
                </div>
            </div>
        );
    }

    private onToggleDropdown() {
        this.menu.style.minWidth = this.dropdown.clientWidth + 'px';

        this.props.onFocus();
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (keyCode.tab === e.keyCode) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        if (keyCode.escape === e.keyCode && this.props.isOpen) {
            this.onToggleDropdown();
        }

        if (_.contains([keyCode.enter, keyCode.tab], e.keyCode) && this.props.isOpen) {
            const active = _.findWhere(this.props.visibleItems, {active: true});
            if (active) {
                this.props.onChange(active.value);
            }
        } else if (keyCode.enter === e.keyCode) {
            this.onToggleDropdown();
        }

        if (keyCode.downArrow === e.keyCode) {
            this.props.setActive(1);
        }

        if (keyCode.upArrow === e.keyCode) {
            this.props.setActive(-1);
        }
    }

    private handleDocumentClick = (e: MouseEvent) => {
        if (this.props.isOpen && document.contains(e.target as HTMLElement)) {
            const dropdown: HTMLDivElement = ReactDOM.findDOMNode<HTMLDivElement>(this.dropdown);

            if (!dropdown.contains(e.target as Node)) {
                this.props.onDocumentClick();
            }
        }
    }
}
