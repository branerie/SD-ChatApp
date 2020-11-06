const socket = io(window.location.href)
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages-container'),
    groupList: document.getElementById("groups"),
    userList: document.getElementById("members")
}
const username = window.location.search.split("&")[0].split("=")[1] || "gerr0r"
document.title = `SC | ${username}`

// Server detected you . Ask for your data
// socket.on('connect', () => {
//     socket.emit("get-groups" , username)
// })

socket.on('welcome-message', data => {
    console.log(data.msg)
    console.log(data.groups);
    attachMsg(data, 'text-system', "status")
    attachGroups(data.groups)
})

socket.on('quit-message', info => {
    let time = new Date().toLocaleTimeString()
    let data = {
        time,
        user: "SERVER",
        msg: `${info.user} has quit`
    }
    attachMsg(data, 'text-system', info.group)
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
})

socket.on('chat-message', data => {
    console.log(data)
    attachMsg(data, 'text-other')
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    let msg = html.msgInput.value

    // Send message to server
    socket.emit('chat-message', msg)

    // get current time
    let time = new Date()
    let data = {
        time: time.toLocaleTimeString(),
        user: username,
        msg
    }

    // should be in gray color until confirmed !!!
    attachMsg(data, 'text-self')
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

function attachMsg({time, user, msg}, textSrc, winID = "status") {
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
    msgWindow.scrollTop = html.msgPool.scrollHeight;

    html.msgPool.appendChild(msgWindow)

}



function attachGroups(groups) {
    html.groupList.innerHTML = ""
    if (!groups) return
    groups.forEach(group => {
        let element = document.createElement("li")
        element.textContent = group;
        html.groupList.appendChild(element);

        let chatDiv = document.createElement("div")
        chatDiv.id = `group-${group}`
        chatDiv.classList.add("chat-messages","hidden")
        html.msgPool.appendChild(chatDiv)
    });
}

function attachUsers(userlist)  {
    console.log(userlist);
    html.userList.innerHTML = ""
    if (!userlist) return
    userlist.forEach(user => {
        let element = document.createElement("li")
        element.textContent = user;
        html.userList.appendChild(element);
    });
}


// function getUserName() {
//     return window.location.search.split("&")[0].split("=")[1] || "gerr0r"
// }