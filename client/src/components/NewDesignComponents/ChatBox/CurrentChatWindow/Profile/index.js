import { useState } from 'react'
import SettingsPage from '../../../../../pages/SettingsPage'
import TransparentBackground from '../../../../NewDesignComponents/CommonComponents/TransparentBackground'

const Profile = () => {
    const [profile, setProfile] = useState(true)

    if (!profile) return null
    return (
        <>
            <TransparentBackground closeOpenedWindows={() => setProfile(false)} />
            <SettingsPage />
        </>
    )
}

export default Profile
