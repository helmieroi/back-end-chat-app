

const bcrypt = require('bcrypt');
const userService = require("../services/userService");
 

function userController(app){
  const service = userService();
   return { 

      login:(jwt,JWT_SECRET)=>app.get('/login', async (req, res) => {
        const { email, password } = req.body;
      service.findUserByEmail(email).then( async (results)=>{

          const isPasswordValid = await bcrypt.compare(password, results[0].password);
 
          if (!isPasswordValid) {
              return res.status(401).json({ message: 'Invalid username or password' });
          }
          
            // If valid, create a token
            const token = jwt.sign({email: results[0].email }, JWT_SECRET, { expiresIn: '1h' });
          
            res.json({ token });
       
        }).catch(e=>{
          return res.status(401).json({ message: 'Invalid username or password' });
     
        }); 
     
      }),
      signUp:()=>app.post('/signup', async (req, res) => {
        const { firstName,lastName, email, password } = req.body; 
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        return service.saveUser({email, firstName,lastName, hashedPassword, res}); 
        
    })
    }
} 
module.exports = userController;