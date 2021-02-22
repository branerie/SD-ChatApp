import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import ChatPageWrapper from '../../layouts/ChatPageWrapper'

const MainPage = () => {

    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <ChatPageWrapper />
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default MainPage
