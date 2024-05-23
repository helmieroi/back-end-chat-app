

const messageService = require("../services/messagesService");
 

function messageController(app){
  const service = messageService();
   return { 

      send:()=>app.post('/send-messages',
      (req, res) =>   service.saveMessage({...req?.body,res})),

      getMessages: ({ws,wss}) => {
        service.getMessages(ws); 
      },
      insertMessage:({message, wss })=>{
        service.insertMessage({ message, wss }); 
      },
      getAllMessages:()=>app.get("/getAllMessages",(req, res)=>{

       service.getAllMessages({res});
      }),
      getDiscussion:()=>app.get("/discussion",(req, res)=>{
        const userId = req.query.userId;
        service.getDiscussion({userId,res});
       })



    }
}

module.exports = messageController;