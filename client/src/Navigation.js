import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import ChatPageNewDesign from './pages/ChatPageNewDesign'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TryPage from './pages/TryPage'
import RegisterPage from './pages/RegisterPage'
import { AuthenticateUser }  from './context/authenticationContext'

const Navigation = () => {
    const authContextObj = AuthenticateUser()

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={authContextObj.user.loggedIn ? ChatPage : HomePage} />
                <Route exact path='/about' component={AboutPage} />
                <Route exact path='/try' component={TryPage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/register' component={RegisterPage} />
                <Route path='/chat' component={ChatPage} />
                <Route path='/newchat' component={ChatPageNewDesign} />
                
            </Switch>
        </BrowserRouter>
    )
}

export default Navigation
