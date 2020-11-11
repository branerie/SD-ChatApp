import React from 'react'
import "./index.css"

const ChatList = ({ label, data }) => {
    return (
        <div>
            <h2>{label}</h2>
            <ul>
                {data.map((item, i) => {
                    return <li key={`group${i}`}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatList
