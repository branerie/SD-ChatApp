import React, {useState} from 'react'
import styles from './index.module.css'
import Input from '../Input'
import Alert from '../Alert'
import SubmitButton from '../Buttons/SubmitButton'
import authenticate from '../../utils/authenticate'
import { AuthenticateUser } from '../../context/authenticationContext'
import inputValidation from '../../utils/inputValidation'
import { useHistory } from "react-router-dom"

const RegisterMain = () => {
    const url = 'http://localhost:5000/register'
    const [username, setUsername] = useState ('')
    const [password, setPassword] = useState ('')
    const [rePassword, setRePassword] = useState ('')

    const [alertMessage, setAlertMessage] = useState ('')
    const auth = AuthenticateUser()
    const history = useHistory()

    const handleSubmit = async (event) =>{
        event.preventDefault()
        
        setAlertMessage(inputValidation(username, password, rePassword))
       
        if (alertMessage) {
            return
        }
      
        await authenticate(url, {
            username,
            password
        }, (user) =>{
            console.log('Successful registration');
            auth.logIn(user)
            history.push({ pathname: '/chat', username })
        },(error) =>{
            console.log('Error', error);
        } )
    }

    return (
        <form className={styles['register-main']} onSubmit={handleSubmit}>
            <Alert alert={alertMessage}/>
            <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                label='Username'
            />
            <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                label='Password'
                type='password'
                />
            <Input
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                label='RePassword'
                type='password'
            />
            <SubmitButton title='Register' />
        </form>
    )
}

export default RegisterMain