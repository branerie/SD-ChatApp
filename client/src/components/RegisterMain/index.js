import { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import styles from './index.module.css'
import Input from '../Input'
import Alert from '../Alert'
import SubmitButton from '../Buttons/SubmitButton'
import authenticate from '../../utils/authenticate'
import { AuthenticateUser } from '../../context/AuthenticationContext'
import { registerValidation } from '../../utils/inputValidation'

const RegisterMain = () => {
    const url = `${process.env.REACT_APP_HOST}/register`
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [errors, setErrors] = useState([])
    const auth = AuthenticateUser()
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (errors.length) return

        await authenticate(url, {
            username,
            password,
            rePassword
        }, user => {
            auth.logIn(user)
            history.push('/main')
        }, error => {
            setErrors(error)
        })
    }

    useEffect(() => {
        setErrors(registerValidation(username, password, rePassword))
    }, [username, password, rePassword])

    return (
        <form className={styles['register-main']} onSubmit={e => handleSubmit(e)}>
            <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                label='Username'
                placeholder='Username...'
            />
            <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                label='Password'
                placeholder='Password...'
                type='password'
            />
            <Input
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                label='Repeat password'
                placeholder='Repeat password...'
                type='password'
            />
            {errors.length > 0 && <Alert alerts={errors} />}
            <SubmitButton title='REGISTER' />
        </form>
    )
}

export default RegisterMain