const socket = io()
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages'),
    groupList: document.getElementById("groups")
}
let username = ""

// Server detected you but doesn't know your name. Tell him who you are
socket.on('connect', () => {
    username = getUserName()
    document.title = 'SC | '+  username
    socket.emit("login" , username)
})

socket.on("join")

socket.on('welcome-message', data => {
    console.log(data.msg)
    console.log(data.groups);
    attachMsg(data, true)
    attachGroups(data.groups)
})

socket.on('quit-message', user => {
    let time = new Date().toLocaleTimeString()
    let data = {
        time,
        user: "SERVER",
        msg: `${user} has quit`
    }
    attachMsg(data, 'text-system')
})

socket.on('notice-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('join-message', user => {
    let time = new Date().toLocaleTimeString()
    let data = {
        time,
        user: "SERVER",
        msg: `${user} has joined the group`
    }
    attachMsg(data, 'text-system')
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
    // change messages container
    [...e.currentTarget.children].forEach(el => el.classList.remove("selected"))
    e.target.classList.add("selected")
    // change user list
},)

function attachMsg({time, user, msg}, textSrc) {
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

    html.msgPool.appendChild(msgWrapper)
    html.msgPool.scrollTop = html.msgPool.scrollHeight;
}



function attachGroups(groups) {
    html.groupList.innerHTML = ""
    if (!groups) return
    groups.forEach(group => {
        let element = document.createElement("li")
        element.textContent = group;
        html.groupList.appendChild(element);
    });
}

function attachUsers()  {

}


function getUserName() {
    return window.location.search.split("&")[0].split("=")[1] || "gerr0r"
}