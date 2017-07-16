websocket = new WebSocket("ws://localhost:8080/");
let imageOut = '';

let fileInput = document.getElementById('put-file-input');
let fileDisplayArea = document.getElementById('fileDisplayArea');
let chatDisplay = document.getElementById('chat-display');

fileInput.addEventListener('change', function (e) {
    var file = fileInput.files[0];
    console.log(fileInput);
    var reader = new FileReader();
    reader.onload = function (e) {
        imageOut = reader.result;
    }
    reader.readAsDataURL(file);
})


let button = document.getElementById('chat-send-button');


button.onclick = () => {
    let inputMessage = document.getElementById('chat-send-message');
    let inputName = document.getElementById('change-name-input');

    let img;

    if (imageOut !== '') {
        img = `<div class="chat-message_body-img" > <img src='${imageOut}' /> </div>`
    } else {
        img = '';
    }


    websocket.send(JSON.stringify({
        name: inputName.value,
        message: inputMessage.value,
        image: img
    }));

    imageOut = '';
    inputMessage.value = '';
    fileInput.value = '';
    inputMessage.focus();
};
websocket.onopen = () => {
    websocket.send(JSON.stringify({
        image: '1'
    }));
}
websocket.onmessage = (message) => {
    thisMessage = JSON.parse(message.data);
    if (thisMessage.message) {
        runMessage();

    }
    whoIsOnline();
    goToDown();
};
function runMessage() {
    let chatDisplay = document.getElementById('chat-display');
    let chatListItem = document.createElement('li');

    chatListItem.innerHTML = `
        <div class="chat-message_head">
            ${thisMessage.message.name} 
            <span>${thisMessage.message.time}</span>  
        </div>
        <div class="chat-message_body">
            <span class="chat-message_body-head">${thisMessage.message.message}</span>
            ${thisMessage.message.image}
        </div>          
    `;

    chatDisplay.appendChild(chatListItem);
};

function whoIsOnline() {
    let onlineUsers = document.getElementById('online-users');
    onlineUsers.innerHTML = `${thisMessage.users}`
    console.log(thisMessage.users)
};

function goToDown() {
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
