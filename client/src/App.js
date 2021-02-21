import AuthenticationContextProvider from './context/AuthenticationContext'
import Navigation from './Navigation'

const App = ({ children }) => {
  return (
    <AuthenticationContextProvider>
      <Navigation>
        {children}
      </Navigation>
    </AuthenticationContextProvider>
  )
}

export default App
