const username = window.location.search.split("&")[0].split("=")[1] || "gerr0r"
console.log(username);
const socket = io({ reconnectionAttempts: 10, query: { username } })
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages-container'),
    groupList: document.getElementById("groups"),
    userList: document.getElementById("members"),
    status: document.getElementById("status")
}
document.title = `SC | ${username}`


socket.on('disconnect', (reason) => {
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SYSTEM",
        msg: `You have been disconnected from server (${reason}):`,
        textType: 'text-system',
        windowID: "status-window"
    }
    attachMsg(data)
})

socket.on('reconnecting', (attemptNumber) => {
    // console.log(`Attempt to connect to server (${attemptNumber}):`)
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SYSTEM",
        msg: `Attempt to connect to server (${attemptNumber}):`,
        textType: 'text-system',
        windowID: "status-window"
    }
    attachMsg(data)
})

socket.on('reconnect_error', (error) => {
    // console.log("Failed to connect to server.")
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SYSTEM",
        msg: "Failed to connect to server.",
        textType: 'text-system',
        windowID: "status-window"
    }
    attachMsg(data)
});

// Fires if number of retries is reached (unless Infinity)
socket.on('reconnect_failed', () => {
    // console.log("Maximum number of retries reached.")
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SYSTEM",
        msg: "Maximum number of retries reached.",
        textType: 'text-system',
        windowID: "status-window"
    }
    attachMsg(data)
});

socket.on('reconnect', (attemptNumber) => {
    // console.log(`Reconnected to server after ${attemptNumber} retries!`);
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SYSTEM",
        msg: `Reconnected to server after ${attemptNumber} retries!`,
        textType: 'text-system',
        windowID: "status-window"
    }
    attachMsg(data)
});


socket.on('welcome-message', ({ user, msg, groups }) => {
    let data = {
        time: new Date().toLocaleTimeString(),
        user,
        msg,
        textType: 'text-server',
        windowID: "status-window"
    }
    attachMsg(data)
    attachGroups(groups)
})

socket.on('quit-message', info => {
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SERVER",
        msg: `${info.user} has quit`,
        textType: 'text-server',
        windowID: info.group
    }
    attachMsg(data)
    socket.emit('get-userlist', info.group, userlist => attachUsers(userlist)) // optimize ?
})

socket.on('notice-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('join-message', info => {
    let data = {
        time: new Date().toLocaleTimeString(),
        user: "SERVER",
        msg: `${info.user} has joined the group`,
        textType: 'text-server',
        windowID: info.group
    }
    attachMsg(data)
    socket.emit('get-userlist', info.group, userlist => attachUsers(userlist)) // optimize ?
})

socket.on('chat-message', info => {
    console.log(info)
    let data = {
        time: new Date().toLocaleTimeString(),
        user: info.user,
        msg: info.msg,
        textType: 'text-other',
        windowID: info.group
    }
    attachMsg(data)
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    let msg = html.msgInput.value
    let msgWindow = document.querySelector("#groups .selected")
    let group = msgWindow.textContent

    let data = {
        time: new Date().toLocaleTimeString(),
        user: username,
        msg,
        textType: 'text-self',
        windowID: group
    }

    // Send message to server
    // should be in gray color until confirmed !!!
    socket.emit('chat-message', { msg, group }, () => attachMsg(data))

    html.msgInput.value = ''
    html.msgInput.focus()
})

html.status.addEventListener("click", function (e) {
    Array.from(html.msgPool.children).forEach(el => el.classList.add("hidden"))
    document.getElementById(`status-window`).classList.remove("hidden")
    Array.from(html.groupList.children).forEach(el => el.classList.remove("selected"))
    e.target.classList.add("selected")
})

html.groupList.addEventListener("click", function (e) {
    if (e.target === html.groupList) return
    let group = e.target.textContent;
    // change messages container
    Array.from(html.msgPool.children).forEach(el => el.classList.add("hidden"))
    document.getElementById(`group-${group}`).classList.remove("hidden")

    // change user list
    html.status.classList.remove("selected")
    Array.from(e.currentTarget.children).forEach(el => el.classList.remove("selected"))
    e.target.classList.add("selected")
    console.log(group); // validate
    socket.emit('get-userlist', group, userlist => attachUsers(userlist))  // optimize ?
})

function attachMsg({ time, user, msg, textType, windowID }) {
    if (windowID !== "status-window") windowID = "group-" + windowID
    let msgWindow = document.getElementById(windowID)

    let msgWrapper = document.createElement('div')
    let msgText = document.createElement('p')
    let msgLabel = document.createElement('span')
    let textNode = document.createTextNode(msg)


    msgLabel.classList.add('timestamp')
    msgLabel.textContent = ` [${time}] ${user}: `
    msgText.appendChild(msgLabel)

    msgText.classList.add(textType)
    msgText.appendChild(textNode)
    msgWrapper.appendChild(msgText)

    msgWrapper.classList.add('message')

    msgWindow.appendChild(msgWrapper)
    msgWindow.scrollTop = msgWindow.scrollHeight;
}



function attachGroups(groups) {
    html.groupList.innerHTML = ""
    // html.msgPool.innerHTML = ""

    // let statusDiv = document.createElement("div")
    // statusDiv.id = "status-window"
    // statusDiv.classList.add("chat-messages")
    // html.msgPool.appendChild(statusDiv)
    if (!groups) return
    groups.forEach(group => {
        let element = document.createElement("li")
        element.textContent = group;
        html.groupList.appendChild(element);


        let chatDiv = document.createElement("div")
        chatDiv.id = `group-${group}`
        chatDiv.classList.add("chat-messages", "hidden")
        html.msgPool.appendChild(chatDiv)
    });
}

function attachUsers(userlist) {
    console.log(userlist);
    html.userList.innerHTML = ""
    if (!userlist) return
    userlist.forEach(user => {
        let element = document.createElement("li")
        element.textContent = user;
        html.userList.appendChild(element);
    });
}
