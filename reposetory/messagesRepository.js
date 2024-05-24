

const pool = require("../config/dbConfig");

const INSERT_MESSAGE= 'INSERT INTO messages SET ?';
const SELECT_MESSAGES = 'SELECT * FROM messages ORDER BY id DESC LIMIT 10';


function messageRepository(){
return {
   save: async ({message, senderId,receiverId,res})=>{
 
    pool.query(INSERT_MESSAGE, ({message, senderId,receiverId}) ,(err, results) => {
        if (err) throw err;

        if(res)
        res.json(results);
      else 
      return results;
      }); 
   },

   
   getMessages: (ws)=>{
 // Send the last 10 messages to the newly connected client

 pool.query(SELECT_MESSAGES, (err, results) => {
  if (err) {
    console.error('Error selecting data:', err);
    return;
  }
  ws.send(JSON.stringify(results));
});
 
},
    insertMessage: async ({ message, senderId, receiverId, wss }) => { 
      try {
        
        const filePath = `${__dirname}/ressources/son/breaki.mp3`;
        const fs = require('fs');
       const dataFile = (()=> fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'audio/wav'
          });
          res.end(data);
        }))();

console.log('dataFile',dataFile)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(save({message, senderId, receiverId})));
          }
        });
      } catch (err) {
        console.error('Error inserting message:', err);
      }
    },
    getDiscussion:({userId,res})=>{
      return new Promise((resolve, reject) => pool.query(INSERT_MESSAGE, [userId,userId]) ,(err, results) => { 
        if (err)  reject(err);
          resolve(results);
      })
    
       
    }    
}


}

module.exports = messageRepository;