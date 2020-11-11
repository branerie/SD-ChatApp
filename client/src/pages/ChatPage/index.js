import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import io from "socket.io-client"

let socket;

const ChatPage = () => {
    const location = useLocation()
    
    useEffect(() => {
        socket = io("http://localhost:5000", { 
            query: { username: location.username },
            transports: ['websocket'] 
        })
    }, [location.username])

    return (
        <div>
            Chat Page
        </div>
    )
}

export default ChatPage
