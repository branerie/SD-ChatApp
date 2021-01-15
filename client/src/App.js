import React from 'react'
import "./style.css"
import AuthenticationProvider from './context/authenticationContext'
import ThemeContextProvider from './context/ThemeContext'
import Navigation from './Navigation'

const App = (props) => {
  return (
    <ThemeContextProvider>
      <AuthenticationProvider>
        <Navigation>
          {props.children}
        </Navigation>
      </AuthenticationProvider>
    </ThemeContextProvider>
  )
}

export default App
