import classNames from 'classnames';
import * as React from 'react';

import {Svg} from '../svg/Svg';

export interface CollapsibleToggleProps {
    expanded: boolean;
    className?: string;
    svgClassName?: string;
}

export const CollapsibleToggle: React.SFC<CollapsibleToggleProps & React.HTMLAttributes<HTMLSpanElement>> = ({
    expanded,
    className,
    svgClassName,
    ...rest
}) => (
    <Svg
        svgName={expanded ? 'arrow-top-rounded' : 'arrow-bottom-rounded'}
        svgClass={classNames('icon', svgClassName)}
        className={className}
        {...rest}
    />
);
