import AuthenticationContextProvider from './context/AuthenticationContext'
import ThemeContextProvider from './context/ThemeContext'
import Navigation from './Navigation'

const App = ({ children }) => {
  return (
    <ThemeContextProvider>
      <AuthenticationContextProvider>
        <Navigation>
          {children}
        </Navigation>
      </AuthenticationContextProvider>
    </ThemeContextProvider>
  )
}

export default App
