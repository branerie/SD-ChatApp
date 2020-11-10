import React, {useState} from 'react'
import styles from './index.module.css'
import Input from '../Input'
import SubmitButton from '../Buttons/SubmitButton'
import authenticate from '../../utils/authenticate'



const LoginMain = (props) => {
    const url = 'http://localhost:5000/login'
    const [username, setUsername] = useState ('')
    const [password, setPassword] = useState ('')

    const handleSubmit = (event) =>{
        event.preventDefault()
        const promise = fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(token => document.cookie = `x-auth-token=${token}`)
        
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