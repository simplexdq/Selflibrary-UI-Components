import React, { ReactElement, InputHTMLAttributes, forwardRef, ChangeEvent } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import classNames from "classnames";
import Icon from '../Icon/icon';

type InputSize = 'lg' | 'sm';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
    disabled?: boolean;
    size?: InputSize;
    icon?: IconProp;
    prepend?: string | ReactElement;
    append?: string | ReactElement;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    //取出各种的属性
    const {
        disabled,
        size,
        icon,
        prepend,
        append,
        style,
        ...restProps
    } = props
    //根据属性计算不同的className
    const cnames = classNames('input-wrapper', {
        [`input-size-${size}`]: size,
        'is-disabled': disabled,
        "input-group": prepend || append,
        'input-group-append': !!append,
        'input-group-prepend': !!prepend
    })
    const fixControlledValue = (value: any) => {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        return value
    }
    if ('value' in props) {
        delete restProps.defaultValue
        restProps.value = fixControlledValue(props.value)
    }

    return (
        //根据属性判断是否要添加特定的节点
        <div className={cnames} style={style}>
            {prepend &&
                <div className="input-group-prepend">
                    {prepend}
                </div>}
            {icon &&
                <div className='icon-wrapper'>
                    <Icon icon={icon} title={`title-${icon}`} />
                </div>}
            <input
                ref={ref}
                className='input-inner'
                disabled={disabled}
                {...restProps}
            />
            {append &&
                <div className='input-group-append'>
                    {append}
                </div>}
        </div>
    )
})

export default Input;