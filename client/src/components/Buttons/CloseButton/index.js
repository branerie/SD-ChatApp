import React, { useContext } from "react"
import './index.css'
import { MessagesContext } from '../../../context/MessagesContext'

const CloseButton = ({ name, type, item }) => {
    const { updateChats } = useContext(MessagesContext)
    function handleClick() {
        if (type === "chat") updateChats(item, "close")
        // else >>> group : Leave group logic
    }
    return (
        <button className='close-btn' onClick={handleClick}>{name}</button>
    )
}

export default CloseButton