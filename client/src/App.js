import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import "./style.css"
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserContext from './Context'

import MessagesContextProvider from './context/MessagesContext'
import { SocketContextProvider } from './context/SocketContext'

const App = () => {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  const logIn = (user) => {
    setUser({
      ...user,
      loggedIn: true
    })
  }

  const logOut = () => {
    document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    setUser({
      loggedIn: false
    });
  }

  return (
    <UserContext.Provider value={{
      user,
      logIn,
      logOut
    }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Switch>
          <MessagesContextProvider>
            <Switch>
              <Route path="/chat" component={ChatPage} />
            </Switch>
          </MessagesContextProvider>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
