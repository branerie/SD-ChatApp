import React, { useEffect, useState } from 'react'
import io from "socket.io-client"
import getCookie from '../utils/cookie';
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
            auth: { token: getCookie('x-auth-token')},
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