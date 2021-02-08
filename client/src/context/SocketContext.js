import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import { AuthenticateUser } from './authenticationContext'

export const SocketContext = React.createContext()

export default function SocketContextProvider(props) {
    const auth = AuthenticateUser()
    const [socket, setSocket] = useState()

    useEffect(() => {
        if (!auth) return

        const url = process.env.REACT_APP_HOST
        const request = io(url, {
            reconnectionAttempts: 10,
            transports: ['websocket']
        })

        setSocket(request)

        return () => request.disconnect()
    }, [auth])

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    )
}