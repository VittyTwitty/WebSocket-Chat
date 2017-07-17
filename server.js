const express = require('express'),
  http = require('http'),
  url = require('url'),
  WebSocket = require('ws'),
  app = express();

let resultT = '';  

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'mydb'
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


//app.use(express.static('app'));


function dataTable() {
  con.connect(function(err) {
    if (err) throw err;
    // let sql = 'INSERT INTO students (name, age, groups) VALUE ("Vitalii", 23, 110)';
    // con.query(sql, function(err, result) {
    //     if (err) throw err;
    //     console.log(result);
    // });
    let sql = 'SELECT * FROM students';
    con.query(sql, function(err, result) {      
        resultT = result;
    });
  });
}
app.get('/', function (req, res) {
  //res.sendFile(__dirname + '/index.html');
  console.log(resultT)
  res.send(resultT);
  
});

users = [];

let nameNow;
wss.on('open', function (ws) {
  ws.send(JSON.stringify({
    users: users.length
  }));
});

wss.on('connection', function connewction(ws) {

  let counterOfUsers = users.length;
  ws.user_id = counterOfUsers;
  let usersInfo = {
    idOfUser: counterOfUsers,
    sender: ws._sender
  };
  users.push(users.length);
  console.log("Player ID ", users.length, "is connected");


  ws.on('close', function () {
    for (let i = 0; i < users.length; i++) {
      if (usersInfo.idOfUser == ws.user_id) {
        console.log("Player ID ", usersInfo.idOfUser, "is exit");
        users.splice(i, 1);
        break;
      }
    }
  });


  ws.on('message', function incoming(message) {
    let time = new Date().toLocaleTimeString();
    thisMessage = JSON.parse(message);
    if (thisMessage.name && (thisMessage.message || thisMessage.image)) {
      if (thisMessage.name === nameNow) {
        wss.broadcast({
          id: users.length,
          time: time,
          name: '',
          message: thisMessage.message,
          image: thisMessage.image
        });
      } else {
        nameNow = thisMessage.name;
        wss.broadcast({
          id: users.length,
          time: time,
          name: thisMessage.name,
          message: thisMessage.message,
          image: thisMessage.image
        });
      }

    }
  });

  ws.onopen = () => {
    ws.send((JSON.stringify({
      id: users.length
    })));
  };
});

wss.broadcast = function broadcast(thisMessage) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify({
      message: thisMessage,
      users: users.length
    }));
  });
};

server.listen(8080, function listening() {

  console.log('Listening on %d', server.address().port);

})



setInterval(wss.broadcast, 1500);





