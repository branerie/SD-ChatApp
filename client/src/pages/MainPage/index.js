import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import MainPageParent from '../../components/MainPageParent'

const MainPage = () => {

    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <MainPageParent />
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default MainPage
