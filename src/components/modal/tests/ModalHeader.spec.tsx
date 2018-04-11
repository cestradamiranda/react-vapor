import {mount, ReactWrapper, shallow} from 'enzyme';
import * as React from 'react';
import * as _ from 'underscore';
import {IModalHeaderProps, ModalHeader} from '../ModalHeader';

describe('ModalHeader', () => {
    const basicProps: IModalHeaderProps = {
        id: 'modal',
        title: 'Title',
    };

    describe('<ModalHeader />', () => {
        it('should render without errors', () => {
            expect(() => {
                shallow(
                    <ModalHeader {...basicProps} />,
                );
            }).not.toThrow();
        });
    });

    describe('<ModalHeader />', () => {
        let modal: ReactWrapper<IModalHeaderProps, any>;

        const setChildren = (children: any = 'any') => {
            modal.setProps(_.extend({}, basicProps, {children}));
        };

        beforeEach(() => {
            modal = mount(
                <ModalHeader {...basicProps} />,
                {attachTo: document.getElementById('App')},
            );
        });

        afterEach(() => {
            modal.unmount();
            modal.detach();
        });

        it('should call prop onClose when modal x clicked and prop is set', () => {
            const closeSpy = jasmine.createSpy('onClose');

            modal.setProps(_.extend({}, basicProps, {onClose: closeSpy}));
            modal.mount();
            const input = modal.find('.small-close');
            input.simulate('click');
            expect(closeSpy.calls.count()).toBe(1);
        });

        it('should set class when the class is specified', () => {
            const headerClass = 'mod-big';
            const classes = [headerClass];
            const header = modal.find('header').first();
            expect(header.hasClass(headerClass)).toBe(false);

            modal.setProps(_.extend({}, basicProps, {classes}));
            modal.mount();
            expect(header.hasClass(headerClass)).toBe(true);
        });

        it('should have the class inline on the title only if there are children', () => {
            const expectedClass: string = 'inline';

            expect(modal.find('h1').hasClass(expectedClass)).toBe(false);

            setChildren();

            expect(modal.find('h1').hasClass(expectedClass)).toBe(true);
        });

        it('should have a div wrapper arround the title only if there are children', () => {
            expect(modal.find('h1').parent().type()).not.toBe('div');

            setChildren();

            expect(modal.find('h1').parent().type()).toBe('div');
        });
    });
});
