
import React from 'react'
import { Card as AntCard } from 'antd'

import { CardProps } from 'antd/lib/card/index'

interface Props extends CardProps {
}

/**
 *  卡片容器,默认会对齐到当前页面的底部
 */
const Card = function (props: Props) {
    const { style, ...restProps } = props
    return (
        <AntCard
            style={{
                height: '0px',
                paddingBottom: '100%',
                overflow: 'scroll',
                ...style,
            }}
            {...restProps}/>
    )
}

export { Card }
