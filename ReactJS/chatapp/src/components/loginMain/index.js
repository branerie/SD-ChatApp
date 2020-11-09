import React, {useState} from 'react'
import styles from './index.module.css'
import Input from '../input'
import SubmitButton from '../buttons/submitButton'
import authenticate from '../../utils/authenticate'



const LoginMain = (props) => {
    const [username, setUsername] = useState ('')
    const [password, setPassword] = useState ('')

    const handleSubmit = async (event) =>{
        event.preventDefault()
        await authenticate('http://localhost:5000/login', {
            username,
            password
        }, (user) =>{
    
        },(error) =>{
    
        } )
    }

    return (
        <form className={styles['login-main']} onSubmit={handleSubmit}>
            <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                label='Username'
            />
            <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                label='Password'
            />
            <SubmitButton title='Login' />
        </form>
    )
}

export default LoginMain