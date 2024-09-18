const jwt = require('jsonwebtoken');

//Middleware for verifying the tokens

function verifyToken(req, res, next) {
  
  if(req.headers.authorization !== undefined){
  
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'nutrifyapp', (err, data) => {
      if (!err) {
        next();
       
      }
      else{
        return res.status(403).send({ message: 'Invalid Token, not allowed to access' });

      }
      
    });
  } 

  else 
  {
    res.status(401).send({ message: 'Please send a token in the Authorization header' });
  }
}

module.exports = verifyToken;