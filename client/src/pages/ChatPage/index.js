import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from "react-router-dom"
import ChatList from "../../components/ChatList"
import io from "socket.io-client"
import "./index.css"

// let socket;

const ChatPage = () => {
    const location = useLocation()
    const [username, setUsername] = useState(location.username)
    const [socketID, setSocketID] = useState(null)
    const [groups, setGroups] = useState([])
    const [confs, setConfs] = useState(['conf', 'conf2', 'conf3']) //dummy 
    const [chats, setChats] = useState(['user1', 'user2', 'user3']) //dummy

    const socket = useRef()

    useEffect(() => {

        socket.current = io("http://localhost:5000", {
            query: { username: location.username },
            transports: ['websocket']
        })

        socket.current.on("connect", () => {
            setSocketID(socket.id)
            console.log([socketID, username]);
        })

        socket.current.on('welcome-message', ({ user, msg, groups }) => {
            welcomeMessage(groups)
            // let data = {
            //     time: new Date().toLocaleTimeString(),
            //     user,
            //     msg,
            //     textType: 'text-server',
            //     windowType: null,
            //     windowID: "status-window"
            // }
            // attachMsg(data)
            // attachGroups(groups)
        })
    }, [])

    function welcomeMessage(groups) {
        setGroups(groups)
    }

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1>SmartChat / STATUS</h1>
                <a href="index.html" className="btn">X</a>
            </header>
            <main className="chat-main">
                <aside className="chat-sidebar">
                    <ul><li id="status" className="selected">STATUS</li></ul>
                    {groups ? <ChatList label={"groups"} data={groups} /> : null}
                    {confs ? <ChatList label={"conferences"} data={confs} /> : null}
                    {chats ? <ChatList label={"chats"} data={chats} /> : null}
                </aside>
                <div className="chat-messages-container">
                    <div className="chat-messages" id="status-window"></div>
                    {groups.map(group => {
                        return <div className="chat-messages hidden" id={`group-${group}`}></div>
                    })}
                </div>
                <aside className="chat-sidebar chat-members hidden">
                    <h2>ONLINE</h2>
                    <ul id="members"></ul>
                </aside>
            </main>
            <div className="chat-form-container">
                <form id="chat-form">
                    <input id="msg-input" type="text" required autoComplete="off" />
                    <button className="btn">Send</button>
                </form>
            </div>
        </div>
    )
}

export default ChatPage
