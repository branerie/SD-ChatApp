import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'

const WelcomeMessage = () => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={styles.container}>
            <div>Welcome to SmartChat Network.</div>
            {Object.keys(userData.sites).length === 0 &&
                <div>
                    <p>It looks like you're not a member of any projects.</p>
                    <p>You can create your own projects or join existing ones.</p>
                    <p>To create a new one, use the 'Create new project' section below. Later, you can send invitations to let other people know about it.</p>
                    <p>To join existing projects, use the search utility in the 'Find project' section.</p>
                    <p>When you find the project you were looking for, send a join request and wait for approval from the owner.</p>
                    <p>In the meantime, you can add more info about yourself from the 'Profile' menu. Enjoy!</p>
                </div>
            }
        </div>
    )
}

export default WelcomeMessage
