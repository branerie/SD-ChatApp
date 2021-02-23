import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import Input from '../Input'
import Alert from '../Alert'
import SubmitButton from '../Buttons/SubmitButton'
import authenticate from '../../utils/authenticate'
import { AuthenticateUser } from '../../context/AuthenticationContext'
import { loginValidation } from '../../utils/inputValidation'

const LoginMain = () => {
    const url = `${process.env.REACT_APP_HOST}/login`
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const auth = AuthenticateUser()
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (errors.length) return

        await authenticate(url, { username, password },
            user => {
                auth.logIn(user)
                history.push('/main')
            },
            error => {
                setErrors(error)
            })
    }

    useEffect(() => {
        setErrors(loginValidation(username, password))
    }, [username, password])

    return (
        <form className={styles['login-main']} onSubmit={e => handleSubmit(e)}>
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
                type="password"
            />
            {errors.length > 0 && <Alert alerts={errors} />}
            <SubmitButton title='LOGIN' />
        </form>
    )
}

export default LoginMain