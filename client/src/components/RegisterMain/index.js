import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import Input from '../Input'
import Alert from '../Alert'
import SubmitButton from '../Buttons/SubmitButton'
import authenticate from '../../utils/authenticate'
import { AuthenticateUser } from '../../context/authenticationContext'
import inputValidation from '../../utils/inputValidation'
import { useHistory } from "react-router-dom"

const RegisterMain = () => {
    const url = `${process.env.REACT_APP_HOST}/register`
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')

    const [alertMessage, setAlertMessage] = useState(null)
    const auth = AuthenticateUser()
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (alertMessage) {
            return
        }

        await authenticate(url, {
            username,
            password,
            rePassword
        }, (user) => {
            console.log(user);
            console.log('Successful registration');
            auth.logIn(user)
            history.push('/newchat')
        }, (error) => {
            console.log('Error', error);
        })
    }

    useEffect(() => {
        setAlertMessage(inputValidation(username, password, rePassword))
    }, [username, password, rePassword])

    return (
        <form className={styles['register-main']} onSubmit={e => handleSubmit(e)}>
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
                label='Repeat password'
                type='password'
            />
            <Alert alert={alertMessage} />
            <SubmitButton title='REGISTER' />
        </form>
    )
}

export default RegisterMain