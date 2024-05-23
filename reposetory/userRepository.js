

const pool = require("../config/dbConfig")
const SELECT_USER_BY_EMAIL = 'SELECT * FROM user WHERE email = ?';
const INSERT_USER ='INSERT INTO user SET ?';
function userRepository() {
    return {
        userByEmail:({ email }) => {
        
            return new Promise((resolve, reject) => pool.query(SELECT_USER_BY_EMAIL, [email] ,(err, results) => { 
                if (err)  reject(err);
                  resolve(results);
              })) 
        
        
            },
        save:(data)=>{
            const {email, firstName,lastName, hashedPassword} = data; 

            pool.query(INSERT_USER, {email, firstName,lastName, password:hashedPassword} ,(err, results) => {
                if (err)  {
                    console.log(err)
                    return data?.res.status(500).send('Internal Server Error');}
                return data.res.status(201).send('User created successfully');
              });  
             
        }
    };
}

module.exports = userRepository;