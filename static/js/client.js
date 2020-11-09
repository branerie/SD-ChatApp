const username = window.location.search.split("&")[0].split("=")[1] || "gerr0r"
console.log(username);
const socket = io({ reconnectionAttempts: 3, query: { username } })
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages-container'),
    groupList: document.getElementById("groups"),
    userList: document.getElementById("members")
}
document.title = `SC | ${username}`

socket.on('reconnecting', (attemptNumber) => {
    console.log(`Attempt to connect to server (${attemptNumber}):`)
});

socket.on('reconnect_error', (error) => {
    console.log("Failed to connect to server.")
});

// Fires if number of retries is reached (unless Infinity)
socket.on('reconnect_failed', () => {
    console.log("Maximum number of retries reached.")
});

socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected to server after ${attemptNumber} retries!`);
});


socket.on('welcome-message', ({ user, msg, groups }) => {
    let data = {
        time: new Date().toLocaleTimeString(),
        user,
        msg
    }
    attachMsg(data, 'text-system', "status")
    attachGroups(groups)
})

socket.on('quit-message', info => {
    let time = new Date().toLocaleTimeString()
    let data = {
        time,
        user: "SERVER",
        msg: `${info.user} has quit`
    }
    attachMsg(data, 'text-system', info.group)
    socket.emit('get-userlist', info.group, userlist => attachUsers(userlist)) // optimize ?
})

socket.on('notice-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('join-message', info => {
    let time = new Date().toLocaleTimeString()
    let data = {
        time,
        user: "SERVER",
        msg: `${info.user} has joined the group`
    }
    attachMsg(data, 'text-system', info.group)
    socket.emit('get-userlist', info.group, userlist => attachUsers(userlist)) // optimize ?
})

socket.on('chat-message', info => {
    console.log(info)
    let data = {
        time: new Date().toLocaleTimeString(),
        user: info.user,
        msg: info.msg
    }
    attachMsg(data, 'text-other', info.group)
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    let msg = html.msgInput.value
    let msgWindow = document.querySelector("#groups .selected")
    let group = msgWindow.textContent

    // Send message to server
    socket.emit('chat-message', { msg, group })

    // get current time
    let data = {
        time: new Date().toLocaleTimeString(),
        user: username,
        msg
    }

    // should be in gray color until confirmed !!!
    attachMsg(data, 'text-self', group)
    html.msgInput.value = ''
    html.msgInput.focus()
})

html.groupList.addEventListener("click", function (e) {
    if (e.target === html.groupList) return
    let group = e.target.textContent;
    // change messages container
    [...html.msgPool.children].forEach(el => el.classList.add("hidden"));
    document.getElementById(`group-${group}`).classList.remove("hidden");

    // change user list
    [...e.currentTarget.children].forEach(el => el.classList.remove("selected"))
    e.target.classList.add("selected")
    console.log(group); // validate
    socket.emit('get-userlist', group, userlist => attachUsers(userlist))
})

function attachMsg({ time, user, msg }, textSrc, winID = "status") {
    if (winID !== "status") winID = "group-" + winID
    let msgWindow = document.getElementById(winID)

    let msgWrapper = document.createElement('div')
    let msgText = document.createElement('p')
    let msgLabel = document.createElement('span')
    let textNode = document.createTextNode(msg)


    msgLabel.classList.add('timestamp')
    msgLabel.textContent = ` [${time}] ${user}: `
    msgText.appendChild(msgLabel)

    msgText.classList.add(textSrc)
    msgText.appendChild(textNode)
    msgWrapper.appendChild(msgText)

    msgWrapper.classList.add('message')

    msgWindow.appendChild(msgWrapper)
    msgWindow.scrollTop = msgWindow.scrollHeight;

}



function attachGroups(groups) {
    html.groupList.innerHTML = ""
    html.msgPool.innerHTML = ""

    let statusDiv = document.createElement("div")
    statusDiv.id = `status`
    statusDiv.classList.add("chat-messages")
    html.msgPool.appendChild(statusDiv)
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
