import { useReducer, useContext, useEffect, createContext } from 'react'
import { SocketContext } from './SocketContext'
import UserDataReducer from '../reducers/UserDataReducer'

export const MessagesContext = createContext()

export default function MessagesContextProvider(props) {    
    const { socket } = useContext(SocketContext)    
    const [userData, dispatchUserData] = useReducer(UserDataReducer, false)

    useEffect(() => {
        if (!socket) return
        
        socket.on('connect', () => {
            document.title = `SmartChat | Loading...`
        })

        socket.on('welcome-message', userData => {
            document.title = `SmartChat | ${userData.personal.username}`
            dispatchUserData({ type: 'welcome-message', payload: { userData } })

        })

        socket.on('group-chat-message', msgData => {
            dispatchUserData({ type: 'group-chat-message', payload: { msgData } })
        })

        socket.on('single-chat-message', msgData => {
            dispatchUserData({ type: 'single-chat-message', payload: { msgData } })
        })

        socket.on('create-site', siteData => {
            dispatchUserData({ type: 'create-site', payload: { siteData } })
        })

        socket.on('create-group', ({ site, groupData }) => {
            dispatchUserData({ type: 'create-group', payload: { site, groupData } })
        })

        socket.on('add-user-to-site-invitations', ({ site, user }) => {
            dispatchUserData({ type: 'add-user-to-site-invitations', payload: { site, user } })
        })

        socket.on('add-site-to-invitations', siteData => {
            dispatchUserData({ type: 'add-site-to-invitations', payload: { siteData } })
        })

        socket.on('invitation-accepted', ({ siteData, associatedUsers }) => {
            dispatchUserData({ type: 'invitation-accepted', payload: { siteData, associatedUsers } })
        })

        socket.on('remove-site-from-invitations', site => {
            dispatchUserData({ type: 'remove-site-from-invitations', payload: { site } })
        })

        socket.on('remove-user-from-site-invitations', ({ user, site }) => {
            dispatchUserData({ type: 'remove-user-from-site-invitations', payload: { user, site } })
        })

        socket.on('remove-site-from-requests', site => {
            dispatchUserData({ type: 'remove-site-from-requests', payload: { site } })
        })

        socket.on('remove-user-from-site-requests', ({ user, site }) => {
            dispatchUserData({ type: 'remove-user-from-site-requests', payload: { user, site } })
        })

        socket.on('add-site-to-requests', siteData => {
            dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
        })

        socket.on('add-user-to-site-requests', ({ site, user }) => {
            dispatchUserData({ type: 'add-user-to-site-requests', payload: { site, user } })
        })

        socket.on('request-accepted', ({ site, associatedUsers }) => {
            dispatchUserData({ type: 'request-accepted', payload: { site, associatedUsers } })
        })

        socket.on('added-to-group', ({ site, group }) => {
            dispatchUserData({ type: 'added-to-group', payload: { site, group } })
        })

        socket.on('join-message', ({ user, site, group }) => {
            dispatchUserData({ type: 'join-message', payload: { user, site, group } })
        })

        socket.on('online-message', ({ user }) => {
            dispatchUserData({ type: 'online-message', payload: { user } })
        })

        socket.on('quit-message', ({ user }) => {
            dispatchUserData({ type: 'quit-message', payload: { user } })
        })

        socket.on('update-profile-data', newData => {
            dispatchUserData({ type: 'update-profile-data', payload: { newData } })
        })

        socket.on('profile-update', ({ user }) => {
            dispatchUserData({ type: 'profile-update', payload: { user } })
        })

        socket.on('disconnect', (reason) => {
            dispatchUserData({ type: 'disconnect-message' })
        })

        // socket.io.on('reconnect_attempt', (attemptNumber) => {
        //     // dispatchUserData({ type: 'reconnect-attempt-message', payload: { attemptNumber } })
        // })

        // socket.io.on('reconnect_error', (error) => {
        //     // dispatchUserData({ type: 'reconnect-error-message', payload: { error } })
        // })

        // socket.io.on('reconnect_failed', () => {
        //     // dispatchUserData({ type: 'reconnect-failed-message' })
        // })

        // socket.io.on('reconnect', (attemptNumber) => {
        //     // dispatchUserData({ type: 'reconnect-message', payload: { attemptNumber } })
        //     socket.off('connect')
        // })

        return () => socket.offAny()
    }, [socket])

    function sendMessage(msg, type = 'plain') {
        let msgType, dst, site = userData.activeSite
        if (site) {
            msgType = 'group-chat-message'
            dst = userData.activeGroup
        } else {
            msgType = 'single-chat-message'
            dst = userData.activeChat
        }

        if (type !== 'image' && (msg.startsWith('http://') || msg.startsWith('https://'))) type = 'uri'
        let socketData = { msg, type, dst }
        socket.emit(msgType, socketData, error => {
            if (error) {
                dispatchUserData({ type: 'error-message', payload: { error } })
                return
            }

            let src = userData.personal._id
            if (dst === src) return // on personal notes

            let msgData = { msg, type, src, dst, site }
            dispatchUserData({ type: msgType, payload: { msgData } })
        })
        return
    }

    return (
        <MessagesContext.Provider value={{
            userData, dispatchUserData, sendMessage
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}
