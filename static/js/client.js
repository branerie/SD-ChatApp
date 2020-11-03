const socket = io()
const html = {
    sendMsg: document.getElementById('chat-form'),
    msgInput: document.getElementById('msg-input')
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
})


html.sendMsg.addEventListener('submit', e => {
    e.preventDefault()
    // console.log(html.msgInput.value)

    // Send message to server
    socket.emit('chat-message', html.msgInput.value)
    html.msgInput.value = ''
}) 