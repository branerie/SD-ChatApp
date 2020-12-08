import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import { AuthenticateUser } from './authenticationContext'

export const SocketContext = React.createContext()

export default function SocketContextProvider(props) {
    const auth = AuthenticateUser()
    const [socket, setSocket] = useState()
    const ME = auth.user.username

    useEffect(() => {
        if (!ME) return

        const request = io("http://localhost:5000", {
            reconnectionAttempts: 10,
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