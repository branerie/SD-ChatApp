import React from 'react'
import "./style.css"
import AuthenticationProvider from './context/authenticationContext'
import Navigation from './Navigation'

const App = (props) => {
  return (
    <AuthenticationProvider>
      <Navigation>
        {props.children}
      </Navigation>
    </AuthenticationProvider>
  )
}

export default App
