import io from 'socket.io-client';
const socket = io("http://localhost:3000");
let userId = null;

const postMessage = () => {
    if(sendInput.value <= 0) return;
    socket.emit("sendMessage", sendInput.value);
    sendInput.value = "";
}

const usersButton = document.getElementById("getUsers");
usersButton.addEventListener('click', () => {
    socket.emit("showUsers");
});

const sendInput = document.getElementById("sendInput");
const sendMessageButton = document.getElementById("sendButton");
sendMessageButton.addEventListener('click', postMessage);
sendInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        postMessage();
    }
});

socket.on("returnId", data => {
    userId = data.uid;
    const uidText = document.getElementsByClassName("uid")[0];
    uidText.innerHTML = `Your ID is: ${data.uid}`
});

socket.on("dispatchMessage", data => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("messageContainer");
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("message");
    if(data.uid !== userId){
        innerDiv.classList.add("outside");
        messageElement.classList.add("move-left");
    }
    const textParagraph = document.createElement("p");
    textParagraph.classList.add("content")
    textParagraph.innerText = data.msg.messageText;
    const dateParagraph = document.createElement("p");
    dateParagraph.classList.add("date");
    dateParagraph.innerText = data.msg.date;

    innerDiv.appendChild(textParagraph);
    innerDiv.appendChild(dateParagraph);
    messageElement.appendChild(innerDiv);

    const messagesContainer = document.getElementsByClassName("messages")[0];
    messagesContainer.appendChild(messageElement);
})