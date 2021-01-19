import React from 'react'
import { ConfigProvider } from 'react-avatar'

export default function AvatarColors(props) {
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

