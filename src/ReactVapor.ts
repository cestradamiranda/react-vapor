import { ILastUpdatedState } from './components/lastUpdated/LastUpdatedReducers';
import { IFacetState } from './components/facets/FacetReducers';
import { IFilterState } from './components/filterBox/FilterBoxReducers';
import { IFacet } from './components/facets/Facet';
import { IPerPageState } from './components/navigation/perPage/NavigationPerPageReducers';
import { ILoadingState } from './components/loading/LoadingReducers';
import { IPaginationState } from './components/navigation/pagination/NavigationPaginationReducers';
import { IInlinePromptOptions } from './components/inlinePrompt/InlinePrompt';
import { IPromptState } from './components/inlinePrompt/InlinePromptReducers';
import { IActionOptions } from './components/actions/Action';
import { IActionBarState } from './components/actions/ActionBarReducers';
import { IDropdownState } from './components/dropdown/DropdownReducers';
import { ITableRowState } from './components/tables/TableRowReducers';
import { IOptionsCycleState } from './components/optionsCycle/OptionsCycleReducers';
import { IDatePickerState } from './components/datePicker/DatePickerReducers';
import { IOptionPickerState } from './components/optionPicker/OptionPickerReducers';
import { IItemFilterState } from './components/actions/filters/ItemFilterReducers';
import { IModalState } from './components/modal/ModalReducers';
import { ISubNavigationState } from './components/subNavigation/SubNavigationReducers';
import { ITabGroupState } from './components/tab/TabReducers';
import { IDropdownSearchState } from './components/dropdownSearch/DropdownSearchReducers';
import { IToastsState } from './components/toast/ToastReducers';
import { ITableHeaderCellsState } from './components/tables/TableHeaderCellReducers';
import { ITableStateModifyer } from './components/tables/TableActions';
import { IDropdownOption } from './components/dropdownSearch/DropdownSearch';
import { ITablesState, ITableData } from './components/tables/TableReducers';

export interface IReactVaporState {
  lastUpdatedComposite?: ILastUpdatedState[];
  facets?: IFacetState[];
  filters?: IFilterState[];
  perPageComposite?: IPerPageState[];
  paginationComposite?: IPaginationState[];
  loadings?: ILoadingState[];
  prompts?: IPromptState[];
  actionBars?: IActionBarState[];
  dropdowns?: IDropdownState[];
  dropdownSearch?: IDropdownSearchState[];
  rows?: ITableRowState[];
  optionsCycles?: IOptionsCycleState[];
  datePickers?: IDatePickerState[];
  optionPickers?: IOptionPickerState[];
  itemFilters?: IItemFilterState[];
  modals?: IModalState[];
  subNavigations?: ISubNavigationState[];
  tabs?: ITabGroupState[];
  toastContainers?: IToastsState[];
  tableHeaderCells?: ITableHeaderCellsState;
  tables?: ITablesState;
}

export interface IReduxActionsPayload {
  id?: string;
  ids?: string[];
  isCollapsible?: boolean;
  facet?: string;
  facetRow?: IFacet;
  filterText?: string;
  pageNb?: number;
  perPage?: number;
  options?: IInlinePromptOptions;
  actions?: IActionOptions[];
  currentOption?: number;
  color?: string;
  date?: Date;
  calendarId?: string;
  value?: string;
  isRange?: boolean;
  limit?: string;
  item?: string;
  label?: string;
  selected?: string;
  tableId?: string;
  attributeToFormat?: string;
  attributeToSort?: string;
  initialTableData?: ITableData;
  initialPerPage?: number;
  tableStateModifyer?: ITableStateModifyer;
  totalEntries?: number;
  totalPages?: number;
  addedSelectedOption?: IDropdownOption;
}
