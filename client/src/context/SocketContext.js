import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import { useLocation } from "react-router-dom"

export const SocketContext = React.createContext()

export default function SocketContextProvider(props) {
    const [socket, setSocket] = useState()
    const location = useLocation()
    const username = location.username

    useEffect(() => {

        const request = io("http://localhost:5000", {
            reconnectionAttempts: 10,
            query: { username },
            transports: ['websocket']
        })

        setSocket(request)

        request.on("connect", () => {
            document.title = username
        })

        return () => request.disconnect()
    }, [username])

    return (
        <SocketContext.Provider value={{ socket, username }}>
            {props.children}
        </SocketContext.Provider>
    )
}