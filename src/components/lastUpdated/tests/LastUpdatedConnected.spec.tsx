import { mount, ReactWrapper } from 'enzyme';
import { LastUpdated, ILastUpdatedProps } from '../LastUpdated';
import { LastUpdatedConnected } from '../LastUpdatedConnected';
import { changeLastUpdated } from '../LastUpdatedActions';
import { clearState } from '../../../utils/ReduxUtils';
import { IReactVaporState } from '../../../ReactVapor';
import { TestUtils } from '../../../utils/TestUtils';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import * as s from 'underscore.string';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

describe('LastUpdated', () => {
  describe('<LastUpdatedConnected />', () => {
    let lastUpdated: ReactWrapper<ILastUpdatedProps, any>;
    let id: string;
    let wrapper: ReactWrapper<any, any>;
    let store: Store<IReactVaporState>;

    beforeEach(() => {
      id = 'last-update';

      store = TestUtils.buildStore();

      wrapper = mount(
        <Provider store={store}>
          <LastUpdatedConnected
            id={id}
            />
        </Provider>,
        { attachTo: document.getElementById('App') }
      );
      lastUpdated = wrapper.find(LastUpdated).first();
    });

    afterEach(() => {
      store.dispatch(clearState());
      wrapper.unmount();
      wrapper.detach();
    });

    it('should get its id as a prop', () => {
      let idProp = lastUpdated.props().id;

      expect(idProp).toBeDefined();
      expect(idProp).toBe(id);
    });

    it('should get last update time as a prop', () => {
      let timeProp = lastUpdated.props().time;

      expect(timeProp).toBeDefined();
    });

    it('should get what to do on render as a prop', () => {
      let onRenderProp = lastUpdated.props().onRender;

      expect(onRenderProp).toBeDefined();
    });

    it('should get what to do on destroy as a prop', () => {
      let onDestroyProp = lastUpdated.props().onDestroy;

      expect(onDestroyProp).toBeDefined();
    });

    it('should display the last update time', () => {
      expect(s.contains(lastUpdated.html(), 'AM') || s.contains(lastUpdated.html(), 'PM')).toBe(true);
    });

    it('should add the last update time in the store on render', () => {
      expect(store.getState().lastUpdatedComposite.filter(timer => timer.id === id).length).toBe(1);
    });

    it('should update the last update time in the store when dispatching a "changeLastUpdated" action', () => {
      expect(store.getState().lastUpdatedComposite.filter(timer => timer.id === id).length).toBe(1);

      let storedTime = store.getState().lastUpdatedComposite.filter(timer => timer.id === id)[0].time;
      store.dispatch(changeLastUpdated(id));
      expect(store.getState().lastUpdatedComposite.filter(timer => timer.id === id)[0]).not.toBe(storedTime);
    });

    it('should remove the last update time in the store on destroy', () => {
      wrapper.unmount();
      expect(store.getState().lastUpdatedComposite.filter(timer => timer.id === id).length).toBe(0);
    });
  });
});
