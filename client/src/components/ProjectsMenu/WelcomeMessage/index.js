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
                    <p>It looks like you don't have any membership.</p>
                    <p>You can create your own projects or join existing ones.</p>
                    <p>To create new one, use the 'Create new project' section below. Later you can send invitations to let other people know about your project.</p>
                    <p>To join existing project, use the search utility in the 'Find project' section. When you find desired project send join request and wait for approve from the owner.</p>
                    <p>By the time you can add more info about yourself from the profile menu. Enjoy!</p>
                </div>
            }
        </div>
    )
}

export default WelcomeMessage
