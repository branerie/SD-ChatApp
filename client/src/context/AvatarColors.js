import React from 'react'
import {ConfigProvider} from 'react-avatar'

const AvatarColors = (props) => {
    const colors = [
        'lightblue',
        'lightgreen',
        'lightcyan'
    ]
    
    return (
        <ConfigProvider colors={colors}>
            {props.children}
        </ConfigProvider>
    )
}

export default AvatarColors
