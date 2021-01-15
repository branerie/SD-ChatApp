import React, { useState, useContext, useEffect } from 'react'
import getCookie from '../utils/cookie'

const AuthenticationContext = React.createContext()

export function AuthenticateUser() {
    return useContext(AuthenticationContext)

}

export default function AuthenticationProvider(props) {
    const [user, setUser] = useState({})

    const logIn = (user) => {
        setUser({
            ...user,
            loggedIn: true,
            newDesign: false
        })
    }

    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        setUser({
            loggedIn: false
        })
    }

    const newDesign = () => {
        setUser({
            newDesign: true
        })
    }

    const oldDesign = () => {
        setUser({
            newDesign: false
        })
    }

    useEffect(() => {
        const token = getCookie('x-auth-token')
        const url = process.env.NODE_ENV === 'production' ? 'https://smartdesignchatapp.herokuapp.com/verify' : 'http://localhost:5000/verify'
        if (!token) {
            logOut()
            return
        }

        async function fetchData() {
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
                logOut()
            }
        }

        fetchData()
        return
        
    }, [])

    return (
        <AuthenticationContext.Provider value={{ user, logIn, logOut, newDesign, oldDesign }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}


