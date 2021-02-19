import { useState, useContext, useEffect, createContext } from 'react'
import getCookie from '../utils/cookie'

const AuthenticationContext = createContext()

export function AuthenticateUser() {
    return useContext(AuthenticationContext)

}

export default function AuthenticationContextProvider({ children }) {
    const [user, setUser] = useState({})

    const logIn = (data) => {
        setUser({
            ...data,
            loggedIn: true
        })
    }

    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        setUser({
            loggedIn: false
        })
    }

    useEffect(() => {
        const token = getCookie('x-auth-token')
        const url = `${process.env.REACT_APP_HOST}/verify`
        if (!token) {
            logOut()
            return
        }

        (async () => {
            try {
                const promise = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                const response = await promise.json()
                if (response.status) {
                    logIn({
                        username: response.user,
                        id: response.userID
                    })
                } else {
                    //handle false token error
                    logOut()
                }
            } catch (error) {
                // handle server not accessible error
                // maybe logOut is not neccessary here
                // logOut()
            }
        })()
        return
    }, [])

    return (
        <AuthenticationContext.Provider value={{ user, logIn, logOut }}>
            {children}
        </AuthenticationContext.Provider>
    )
}


