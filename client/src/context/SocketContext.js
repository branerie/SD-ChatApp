import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import { useLocation } from "react-router-dom"

export const SocketContext = React.createContext()

export default function SocketContextProvider(props) {
    const [socket, setSocket] = useState()
    const location = useLocation()
    const ME = location.username

    useEffect(() => {

        const request = io("http://localhost:5000", {
            reconnectionAttempts: 10,
            query: { username: ME },
            transports: ['websocket']
        })

        setSocket(request)

        return () => request.disconnect()
    }, [ME])

    return (
        <SocketContext.Provider value={{ socket, ME }}>
            {props.children}
        </SocketContext.Provider>
    )
}