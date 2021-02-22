import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TryPage from './pages/TryPage'
import RegisterPage from './pages/RegisterPage'
import { AuthenticateUser } from './context/AuthenticationContext'

const Navigation = () => {
    const auth = AuthenticateUser()

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/'>
                    {auth.user.loggedIn ? <Redirect to='/main' /> : <HomePage />}
                </Route>
                <Route exact path='/login'>
                    {auth.user.loggedIn ? <Redirect to='/main' /> : <LoginPage />}
                </Route>
                <Route exact path='/register'>
                    {auth.user.loggedIn ? <Redirect to='/main' /> : <RegisterPage />}
                </Route>
                <Route exact path='/main' >
                    {auth.user.loggedIn ? <ChatPage /> : <Redirect to='/' />}
                </Route>
                <Route exact path='/about' component={AboutPage} />
                <Route exact path='/try' component={TryPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default Navigation
