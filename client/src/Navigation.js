import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import { AuthenticateUser }  from './context/authenticationContext'

const Navigation = () => {
    const user = AuthenticateUser()
    // console.log(user)

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={user.user.loggedIn ? ChatPage : HomePage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/register' component={RegisterPage} />
                <Route path='/chat' component={ChatPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default Navigation
