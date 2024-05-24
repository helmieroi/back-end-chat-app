

 
const fs = require('fs').promises;
const path = require('path');
const messageService = require("../services/messagesService");
 

function messageController(app){
  const service = messageService();
   return { 

      send:()=>app.post('/send-messages',
      (req, res) =>   service.saveMessage({...req?.body,res})),

      getMessages: ({ws,wss}) => {
        service.getMessages(ws); 
      },
      insertMessage:async({message, wss })=>{
        service.insertMessage({ message, wss }); 
      },
      getAllMessages:()=>app.get("/getAllMessages",async(req, res)=>{
        const filePaths = [
          path.join(__dirname, 'ressources', 'son', 'breaki.mp3'),
          // Add more file paths as needed
        ];
    
        try {
          // Read all files and convert to base64
          const base64Strings = await Promise.all(
            filePaths.map(async (filePath) => {
              const data = await fs.readFile(filePath);
              return data.toString('base64');
            })
          );
    
          // Convert base64 strings to Blob objects and create URLs
          const urls = base64Strings.map(base64String => {
            // Convert base64 string to binary data
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            
            // Create Blob object
            const blob = new Blob([byteArray], { type: 'audio/mp3' });
          
            // Create URL for the Blob object
            return URL.createObjectURL(blob);
          });
    
          // Send the URLs in a JSON response
          res.status(200).json({ urls });
        } catch (err) {
          console.error('Error reading files:', err);
          if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
          }
        }
      })
    ,    
      getDiscussion:()=>app.get("/discussion",(req, res)=>{
        const userId = req.query.userId;
        service.getDiscussion({userId,res});
       })



    }
}

module.exports = messageController;