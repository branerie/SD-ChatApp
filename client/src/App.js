import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import "./style.css"
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import MessagesContextProvider from './context/MessagesContext'

const App = () => {
  return (
    <MessagesContextProvider>

      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/chat" component={ChatPage} />
        </Switch>
      </BrowserRouter>
    </MessagesContextProvider>
  )
}

export default App
