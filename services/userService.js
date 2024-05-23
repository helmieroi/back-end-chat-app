
const  userRepository = require("../reposetory/userRepository");

function messageService(){ 
  const repo = userRepository();
 return {
    findUserByEmail:(email)=>{  
    if (!email) {
      return ('Email is required');
    }  
     return repo.userByEmail({email}); 
  
  } , 
  saveUser:(data)=>repo.save(data)
  }

}  

module.exports = messageService;