import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatList = ({ label, data }) => {
    const [selected, setSelected] = useState("STATUS")
    const { changeWindow }  = useContext(MessagesContext)

    function handleClick(item) {
        changeWindow(item)
        setSelected(item)
    }
    return (
        <div>
            <h2>{label}</h2>
            <ul>
                {data.map((item, i) => {
                    return <li key={`group${i}`} className={selected === item ? "selected" : null} onClick={() => handleClick(item)}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatList