const socket = io()
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages')
}
let username = ""

socket.on('connect', () => {
    username = getUserName()
    console.log("Client", socket.id)
    console.log(username)

    socket.emit("login" , username)
})

socket.on('welcome-message', data => {
    console.log(data.msg)
    attachMsg(data, true)
})

socket.on('goodbye-message', msg => {
    console.log(msg)
})

socket.on('notice-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('chat-message', data => {
    console.log(data)
    attachMsg(data, false)
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    let msg = html.msgInput.value
    // console.log(html.msgInput.value)

    // Send message to server
    socket.emit('chat-message', msg)

    // get current time
    let time = new Date()
    let data = {
        time: time.toLocaleTimeString(),
        user: username,
        msg
    }

    // should be in gray color until confirmed
    attachMsg(data, true)
    html.msgInput.value = ''
    html.msgInput.focus()
})

function attachMsg({time, user, msg}, self) {
    let msgWrapper = document.createElement('div')
    let msgText = document.createElement('p')
    let msgLabel = document.createElement('span')
    let textNode = document.createTextNode(msg)
    
    
    msgLabel.classList.add('timestamp')
    msgLabel.textContent = ` [${time}] ${user}: `
    msgText.appendChild(msgLabel)
    
    msgText.classList.add(self ? 'text-self' : 'text-other')
    msgText.appendChild(textNode)
    msgWrapper.appendChild(msgText)

    msgWrapper.classList.add('message')

    html.msgPool.appendChild(msgWrapper)
    html.msgPool.scrollTop = html.msgPool.scrollHeight;
}

function getUserName() {
    return window.location.search.split("&")[0].split("=")[1] || "gerr0r"
}