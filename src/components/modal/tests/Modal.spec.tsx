import {mount, ReactWrapper, shallow} from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import {IModalProps, Modal} from '../Modal';

describe('Modal', () => {
    const id: string = 'modal';

    describe('<Modal />', () => {
        it('should render without errors', () => {
            expect(() => {
                shallow(
                    <Modal
                        id={id}
                    />,
                );
            }).not.toThrow();
        });
    });

    describe('<Modal />', () => {
        let modal: ReactWrapper<IModalProps, any>;
        let modalInstance: Modal;

        beforeEach(() => {
            modal = mount(
                <Modal
                    id={id}
                />,
                {attachTo: document.getElementById('App')},
            );
            modalInstance = modal.instance() as Modal;
        });

        afterEach(() => {
            modal.unmount();
            modal.detach();
        });

        it('should call prop onRender on mounting if set', () => {
            const renderSpy = jasmine.createSpy('onRender');

            expect(() => modalInstance.componentWillMount()).not.toThrow();

            modal.setProps({id: id, onRender: renderSpy});
            modal.unmount();
            modal.mount();
            expect(renderSpy.calls.count()).toBe(1);
        });

        it('should call prop onDestroy on unmounting if set', () => {
            const destroySpy = jasmine.createSpy('onDestroy');

            expect(() => modalInstance.componentWillUnmount()).not.toThrow();

            modal.setProps({id: id, onDestroy: destroySpy});
            modal.mount();
            modal.unmount();
            expect(destroySpy.calls.count()).toBe(1);
        });

        it('should call prop closeCallback on unmounting if set', () => {
            const closeCallbackSpy: jasmine.Spy = jasmine.createSpy('closeCallback');

            modal.setProps({closeCallback: closeCallbackSpy});
            modal.mount();
            modal.unmount();

            expect(closeCallbackSpy.calls.count()).toBe(1);
        });

        it('should call the prop closeCallback if it exists when closing the modal', () => {
            const closeCallbackSpy: jasmine.Spy = jasmine.createSpy('closeCallback');
            modal.setProps({isOpened: true, closeCallback: closeCallbackSpy});
            modal.setProps({isOpened: false});

            expect(closeCallbackSpy).toHaveBeenCalledTimes(1);
        });

        it('should set container class when the container class is specified', () => {
            const containerClass = 'mod-small';
            const classes = [containerClass];
            const container = modal.find('div').first();
            expect(container.hasClass(containerClass)).toBe(false);

            modal.setProps({id, classes});
            modal.mount();
            expect(container.hasClass(containerClass)).toBe(true);
        });

        it('should set opened class on container when isOpened is true', () => {
            const container = modal.find('div').first();
            expect(container.hasClass('opened')).toBe(false);

            modal.setProps({id, isOpened: true});
            modal.mount();
            expect(container.hasClass('opened')).toBe(true);
        });
    });
});
