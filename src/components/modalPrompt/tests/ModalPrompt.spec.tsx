import { shallow, mount, ReactWrapper } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import { ModalPrompt, IModalPromptProps } from '../ModalPrompt';

describe('ModalPrompt', () => {
  const id: string = 'modalPrompt';
  const title: string = 'Title';
  const confirmLabel: string = 'Confirm';
  const cancelLabel: string = 'Cancel';
  const message: string = 'message';

  describe('<ModalPrompt />', () => {
    it('should render without errors', () => {
      expect(() => {
        shallow(
          <ModalPrompt
            id={id}
            title={title}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            message={message}
          />
        );
      }).not.toThrow();
    });
  });

  describe('<ModalPrompt />', () => {
    let modalPrompt: ReactWrapper<IModalPromptProps, any>;
    let modalPromptInstance: ModalPrompt;

    beforeEach(() => {
      modalPrompt = mount(
        <ModalPrompt
          id={id}
          title={title}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          message={message}
        />,
        { attachTo: document.getElementById('App') }
      );
      modalPromptInstance = modalPrompt.instance() as ModalPrompt;
    });

    afterEach(() => {
      modalPrompt.unmount();
      modalPrompt.detach();
    });

    it('should call prop onRender on mounting if set', () => {
      const renderSpy = jasmine.createSpy('onRender');

      expect(() => modalPromptInstance.componentDidMount()).not.toThrow();

      modalPrompt.setProps({ id: id, title: title, onRender: renderSpy });
      modalPrompt.unmount();
      modalPrompt.mount();
      expect(renderSpy.calls.count()).toBe(1);
    });

    it('should call prop onDestroy on unmounting if set', () => {
      const destroySpy = jasmine.createSpy('onDestroy');

      expect(() => modalPromptInstance.componentWillUnmount()).not.toThrow();

      modalPrompt.setProps({ id: id, title: title, onDestroy: destroySpy });
      modalPrompt.mount();
      modalPrompt.unmount();
      expect(destroySpy.calls.count()).toBe(1);
    });

    it('should call prop onCancel when modalPrompt x is clicked and prop is set', () => {
      const cancelSpy = jasmine.createSpy('onClose');
      const input = modalPrompt.find('.small-close');

      input.simulate('click');
      expect(cancelSpy.calls.count()).toBe(0);

      modalPrompt.setProps({ id: id, title: title, onCancel: cancelSpy });
      modalPrompt.mount();
      input.simulate('click');
      expect(cancelSpy.calls.count()).toBe(1);
    });

  });
});
