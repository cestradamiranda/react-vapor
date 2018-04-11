import * as classNames from 'classnames';
import * as React from 'react';
import {IClassName} from '../../utils/ClassNameUtils';
import {Svg} from '../svg/Svg';

export interface IModalHeaderOwnProps {
    id?: string;
    title: string;
    classes?: IClassName;
}

export interface IModalHeaderStateProps {}

export interface IModalHeaderDispatchProps {
    onClose?: () => void;
}

export interface IModalHeaderProps extends IModalHeaderOwnProps, IModalHeaderStateProps, IModalHeaderDispatchProps {}

export class ModalHeader extends React.Component<IModalHeaderProps, {}> {

    close() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        const classes = classNames('modal-header', this.props.classes);

        let closeComponent: JSX.Element = null;
        if (this.props.onClose) {
            closeComponent = (
                <span className='small-close' onClick={() => {this.close();}}>
                    <Svg svgName='close' className='icon mod-lg fill-pure-white' />
                </span>
            );
        }

        return (
            <header className={classes}>
                {
                    !!this.props.children
                        ? (
                            <div>
                                {this.getTitle()}
                                {this.props.children}
                            </div>
                        )
                        : this.getTitle()
                }
                {closeComponent}
            </header>
        );
    }

    private getTitle(): JSX.Element {
        const titleClass: string = classNames({
            inline: !!this.props.children,
        });
        return <h1 className={titleClass}>{this.props.title}</h1>;
    }
}
