import { IReduxAction } from '../../../utils/ReduxUtils';
import { FilterActions, IChangeFilterActionPayload, IFilterActionPayload } from '../FilterBoxActions';
import {
  filterBoxesReducer,
  filterBoxInitialState,
  filterBoxReducer,
  filtersInitialState,
  IFilterState,
} from '../FilterBoxReducers';

describe('FilterBox', () => {

  describe('FilterBoxReducers', () => {
    const genericAction: IReduxAction<IFilterActionPayload> = {
      type: 'DO_SOMETHING',
      payload: {
        id: 'some-filter',
      },
    };

    it('should return the default state if the action is not defined and the state is undefined', () => {
      let oldState: IFilterState[];
      const filtersState: IFilterState[] = filterBoxesReducer(oldState, genericAction);

      expect(filtersState).toBe(filtersInitialState);
    });

    it('should return the default state if the action is not defined and the state is undefined for one filter box', () => {
      let oldState: IFilterState;
      const filterBoxState: IFilterState = filterBoxReducer(oldState, genericAction);

      expect(filterBoxState).toBe(filterBoxInitialState);
    });

    it('should return the old state when the action is not defined', () => {
      const oldState: IFilterState[] = [filterBoxInitialState];
      const filtersState: IFilterState[] = filterBoxesReducer(oldState, genericAction);

      expect(filtersState).toBe(oldState);
    });

    it('should return the old state when the action is not defined for one filter box', () => {
      const oldState: IFilterState = filterBoxInitialState;
      const filterBoxState: IFilterState = filterBoxReducer(oldState, genericAction);

      expect(filterBoxState).toBe(oldState);
    });

    it('should return the old state with one more FilterState when the action is "FilterActions.addFilter"', () => {
      let oldState: IFilterState[] = filtersInitialState;
      const action: IReduxAction<IFilterActionPayload> = {
        type: FilterActions.addFilter,
        payload: {
          id: 'some-filter',
        },
      };
      let filtersState: IFilterState[] = filterBoxesReducer(oldState, action);

      expect(filtersState.length).toBe(oldState.length + 1);
      expect(filtersState.filter((filterBox) => filterBox.id === action.payload.id).length).toBe(1);

      oldState = filtersState;
      action.payload.id = 'some-filter2';
      filtersState = filterBoxesReducer(oldState, action);

      expect(filtersState.length).toBe(oldState.length + 1);
      expect(filtersState.filter((filterBox) => filterBox.id === action.payload.id).length).toBe(1);
    });

    it('should return the old state without the FilterState with the timer id when the action is "FilterActions.removeFilter"', () => {
      let oldState: IFilterState[] = [
        {
          id: 'some-filter2',
          filterText: '',
        }, {
          id: 'some-filter1',
          filterText: 'sdf',
        }, {
          id: 'some-filter3',
          filterText: '',
        },
      ];
      const action: IReduxAction<IFilterActionPayload> = {
        type: FilterActions.removeFilter,
        payload: {
          id: 'some-filter1',
        },
      };
      let filtersState: IFilterState[] = filterBoxesReducer(oldState, action);

      expect(filtersState.length).toBe(oldState.length - 1);
      expect(filtersState.filter((filterBox) => filterBox.id === action.payload.id).length).toBe(0);

      oldState = filtersState;
      action.payload.id = 'some-filter2';
      filtersState = filterBoxesReducer(oldState, action);

      expect(filtersState.length).toBe(oldState.length - 1);
      expect(filtersState.filter((timer) => timer.id === action.payload.id).length).toBe(0);
    });

    it('should update the filter text of a filter box when the action is "FilterActions.filterThrough"', () => {
      const oldState: IFilterState[] = [
        {
          id: 'some-filter2',
          filterText: '',
        }, {
          id: 'some-filter1',
          filterText: 'sdf',
        }, {
          id: 'some-filter3',
          filterText: '',
        },
      ];
      const newFilter = 'something';
      const action: IReduxAction<IChangeFilterActionPayload> = {
        type: FilterActions.filterThrough,
        payload: {
          id: 'some-filter1',
          filterText: newFilter,
        },
      };
      const filtersState: IFilterState[] = filterBoxesReducer(oldState, action);

      expect(filtersState.length).toBe(oldState.length);
      expect(filtersState.filter((filterBox) => filterBox.id === action.payload.id)[0].filterText).toBe(newFilter);
    });
  });
});
