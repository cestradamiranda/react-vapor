import {connect} from 'react-redux';
import {IDispatch, ReduxUtils} from '../../utils/ReduxUtils';
import {closeModal} from './ModalActions';
import {IModalHeaderDispatchProps, IModalHeaderOwnProps, IModalHeaderProps, ModalHeader} from './ModalHeader';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: IDispatch, ownProps: IModalHeaderOwnProps): IModalHeaderDispatchProps => ({
    onClose: () => dispatch(closeModal(ownProps.id)),
});

export const ModalHeaderConnected: React.ComponentClass<IModalHeaderProps> = connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(ModalHeader);
