import React, { useState, useContext, useEffect } from 'react'
import getCookie from '../utils/cookie' 

const AuthenticationContext = React.createContext()

export function AuthenticateUser () {
    return useContext(AuthenticationContext)
   
}

export default function AuthenticationProvider (props){
    const [user, setUser] = useState({})

    const logIn = (useraaa) => {
        setUser({
            ...useraaa,
            loggedIn: true
        })
    }

    const logOut = (user) => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        setUser({
            loggedIn: false
        })
    }

    useEffect(async () => {
        const token = getCookie('x-auth-token')
        if (!token) {
            logOut()
            return
        }

        const promise = await fetch('http://localhost:5000/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const response = await promise.json()
        console.log(response);
        if (response.status) {
            logIn({
                username: response.user,
                id: response.userID
            })
        } else {
            logOut()
        }
    }, [])

    return (
        <AuthenticationContext.Provider value={{user, logIn, logOut}}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}


