import io from "socket.io-client"
import { useEffect, useState, createContext } from 'react'
import { AuthenticateUser } from './AuthenticationContext'

export const SocketContext = createContext()

export default function SocketContextProvider({ children }) {
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
            {children}
        </SocketContext.Provider>
    )
}