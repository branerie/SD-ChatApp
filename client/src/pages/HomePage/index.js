import React from 'react'
import { Link } from 'react-router-dom'

import './index.css'

const HomePage = () => {
    return (
        <div className='header'>
            <Link to="/">Logo</Link>
            <div>
                <Link className='navlink' to="/login">Login</Link>
                <Link className='navlink' to="/register">Register</Link>
                <Link className='navlink' to="/">About</Link>
            </div>
        </div>
    )
}

export default HomePage