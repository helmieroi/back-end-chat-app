
const  messageRepository = require("../reposetory/messagesRepository");

function messageService(){ 
  const repo = messageRepository();
 return {
    saveMessage:({ message, senderId,receiverId,res })=>{  
    if (!message || !senderId || !receiverId) {
      return res.status(400).send('message ,receiverId and senderId are required');
    }
    return repo.save({ message, senderId,receiverId,res });
   
  } ,
  getMessages:(ws)=>{
    repo.getMessages(ws);
},
insertMessage:({ message, wss }) => {
  const parsedMessage = JSON.parse(message);
  return repo.insertMessage({ ...parsedMessage, wss });
},
getAllMessages:({res})=>{

},
getDiscussion:repo.getDiscussion

}  
} 
module.exports = messageService;