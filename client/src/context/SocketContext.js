import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import { AuthenticateUser } from './authenticationContext'

export const SocketContext = React.createContext()

export default function SocketContextProvider(props) {
    const auth = AuthenticateUser()
    const [socket, setSocket] = useState()

    useEffect(() => {
        if (!auth) return

        const url = process.env.NODE_ENV === 'production' ? 'https://smartdesignchatapp.herokuapp.com' : 'http://localhost:5000'
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