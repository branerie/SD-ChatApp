import React, {useState, useContext} from 'react'
import styles from './index.module.css'
import Input from '../Input'
import SubmitButton from '../buttons/SubmitButton'
import authenticate from '../../utils/authenticate'
import UserContext from '../../Context'

const RegisterMain = () => {
    const [username, setUsername] = useState ('')
    const [password, setPassword] = useState ('')
    const [rePassword, setRePassword] = useState ('')
    const context = useContext(UserContext)

    const handleSubmit = async (event) =>{
        event.preventDefault()
        await authenticate('http://localhost:5000/register', {
            username,
            password
        }, (user) =>{
            console.log('You are logged in.');
            context.logIn(user)
        },(error) =>{
            console.log('Error', error);
        } )
    }

    return (
        <form className={styles['register-main']} onSubmit={handleSubmit}>
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