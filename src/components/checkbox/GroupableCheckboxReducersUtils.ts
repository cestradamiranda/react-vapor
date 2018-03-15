import * as _ from 'underscore';
import {IReduxAction} from '../../utils/ReduxUtils';
import {ICheckboxState} from './CheckboxReducers';
import {IGroupableCheckboxActionPayload} from './GroupableCheckboxActions';
import {groupableCheckboxInitialState, IGroupableCheckboxesState} from './GroupableCheckboxReducers';

export const addParentCheckbox = (state: IGroupableCheckboxesState,
                                  action: IReduxAction<IGroupableCheckboxActionPayload>): IGroupableCheckboxesState => {
  const newCheckbox = {
    id: action.payload.id,
    checked: !!action.payload.checked,
  };

  if (state === groupableCheckboxInitialState) {
    return {
      ...state,
      parentId: action.payload.id,
      parent: newCheckbox,
    };
  }

  return {...state, parent: newCheckbox};
};

export const addChildCheckbox = (state: IGroupableCheckboxesState,
                                 action: IReduxAction<IGroupableCheckboxActionPayload>): IGroupableCheckboxesState => {
  const newChecboxes: ICheckboxState[] = state.checkboxes.concat({
    id: action.payload.id,
    checked: !!action.payload.checked,
  });

  const total: number =  state.total + 1;
  const nbChecked: number = state.nbChecked + (action.payload.checked ? 1 : 0);

  if (state === groupableCheckboxInitialState) {
    return {
      ...state,
      parentId: action.payload.parentId,
      total,
      nbChecked,
      checkboxes: newChecboxes,
    };
  }

  return _.extend({}, state, {
    checkboxes: newChecboxes,
    total,
    nbChecked,
  });
};

export const removeParentCheckbox = (state: IGroupableCheckboxesState[],
                                     action: IReduxAction<IGroupableCheckboxActionPayload>): IGroupableCheckboxesState[] => {
  return _.reject(state, (checkboxState: IGroupableCheckboxesState) => action.payload.id === checkboxState.parentId);
};

export const removeChildCheckbox = (state: IGroupableCheckboxesState,
                                    action: IReduxAction<IGroupableCheckboxActionPayload>) => {
  const checkboxState: ICheckboxState = _.findWhere(state.checkboxes, {id: action.payload.id});
  if (checkboxState) {
    state.checkboxes = _.reject(state.checkboxes, (checkbox: ICheckboxState) => checkbox.id === action.payload.id);
    state.nbChecked += (checkboxState && checkboxState.checked ? -1 : 0);
    state.total += checkboxState ? -1 : 0;
  }
};

export const toggleChildCheckbox = (state: IGroupableCheckboxesState,
                                    action: IReduxAction<IGroupableCheckboxActionPayload>) => {
  let isChecked: boolean;
  const checkboxes: ICheckboxState[] = _.map(state.checkboxes, (checkbox: ICheckboxState) => {
    if (checkbox.id === action.payload.id) {
      isChecked = !checkbox.checked;
      return {
        id: checkbox.id,
        checked: isChecked,
      };
    }
    return checkbox;
  });
  if (checkboxes) {
    const nbChecked: number = state.nbChecked += (isChecked ? 1 : -1);
    return {
      ...state,
      parent: {
        id: action.payload.parentId,
        checked: nbChecked === state.total,
      },
      nbChecked,
      checkboxes: [...checkboxes],
    };
  }

  return state;
};

export const toggleParentCheckbox = (state: IGroupableCheckboxesState,
                                     action: IReduxAction<IGroupableCheckboxActionPayload>) => {
  const isChecked: boolean = !state.parent.checked;
  return {
    ...state,
    parent: {
      id: action.payload.id,
      checked: isChecked,
    },
    checkboxes: _.map(state.checkboxes, (checkbox: ICheckboxState) => {
      checkbox.checked = isChecked;
      return checkbox;
    }),
    nbChecked: isChecked ? state.total : 0,
  };
};