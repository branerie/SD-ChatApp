const socket = io()
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input'),
    msgPool: document.querySelector('.chat-messages')
}


socket.on('welcome-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('goodbye-message', msg => {
    console.log(msg)
})

socket.on('notice-message', (msg1, msg2) => {
    console.log(msg1)
    console.log(msg2)
})

socket.on('chat-message', msg => {
    console.log(msg)
    attachMsg(msg, false)
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    let msg = html.msgInput.value
    // console.log(html.msgInput.value)

    // Send message to server
    socket.emit('chat-message', msg)
    attachMsg(msg, true)
    html.msgInput.value = ''
    html.msgInput.focus()
})

function attachMsg(msg, self) {
    let msgWrapper = document.createElement("div")
    let msgText = document.createElement("p")
    let msgLabel = document.createElement("span")
    let textNode = document.createTextNode(msg)
    
    
    msgLabel.classList.add("timestamp")
    msgLabel.textContent = ' [TIMESTAMP] Gogo: '
    msgText.appendChild(msgLabel)
    
    msgText.classList.add(self ? "text-self" : "text-other")
    msgText.appendChild(textNode)
    msgWrapper.appendChild(msgText)

    msgWrapper.classList.add("message")

    html.msgPool.appendChild(msgWrapper)
    html.msgPool.scrollTop = html.msgPool.scrollHeight;
}

