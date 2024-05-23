

const express = require('express');
const { expressjwt: expressJwt } = require('express-jwt');
const messageController = require("./controllers/messageController");
const userController = require('./controllers/userController');
const app = express();
const port = 3000; 
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server:server}); 
const messageCtr = messageController(app); 
const userCtr = userController(app);

const jwt = require('jsonwebtoken');


const JWT_SECRET = 'hD3y@zL9#vM!3bTcX4jG@uW5fQ7pR0tN';

// Middleware to protect routes with JWT
const jwtMiddleware = expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] });

//app.use('/api', jwtMiddleware);



userCtr.login(jwt,JWT_SECRET);


userCtr.signUp();


app.get('/protected', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized');
      res.json({ message: 'This is a protected route' });
  });
});


server.on('upgrade', (request, socket, head) => {
  const token = request.headers['sec-websocket-protocol'];

  if (!token) {
      socket.destroy();
      return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          socket.destroy();
          return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request, decoded);
      });
  });
});



messageCtr.send();


messageCtr.getAllMessages();
 
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  messageCtr.getMessages({ws,wss});

  ws.on('message', (message) => {
    console.log('Received message:', message);
  messageCtr.insertMessage({ message, wss });
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
}) 


const PORT = 3030; // Specify the port number
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
    
 