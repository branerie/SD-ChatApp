import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import io from "socket.io-client"
import "./index.css"

let socket;

const ChatPage = () => {
    const location = useLocation()
    const [username, setUsername] = useState(location.username)
    const [socketID, setSocketID] = useState(null)

    useEffect(() => {

        socket = io("http://localhost:5000", {
            query: { username: location.username },
            transports: ['websocket']
        })

        socket.on("connect", () => {
            setSocketID(socket.id)
            console.log([socketID, username]);
        })
    }, [])

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1>SmartChat / STATUS</h1>
                <a href="index.html" className="btn">X</a>
            </header>
            <main className="chat-main">
                <aside className="chat-sidebar">
                    <ul><li id="status" className="selected">STATUS</li></ul>
                    <h2>GROUPS</h2>
                    <ul id="groups"></ul>
                    <h2>CONFERENCE</h2>
                    <ul id="conf">
                        <li>cid1</li>
                        <li>cid2</li>
                    </ul>
                    <h2>CHATS</h2>
                    <ul id="chat">
                        <li>Unufri</li>
                        <li>Цеца</li>
                    </ul>
                </aside>
                <div className="chat-messages-container">
                    <div className="chat-messages" id="status-window"></div>
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
