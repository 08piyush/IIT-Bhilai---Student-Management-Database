const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const saltRounds = 10;
const queries = require('../model/queries.js');
const nodemailer = require('nodemailer');
const express = require('express');
const apiRouter = express.Router();
const crypto = require('./crypto.js')

// const NodeRSA = require('node-rsa');

// const key = new NodeRSA({b: 2048});

// async function cipher 
// async function decryptCipher(input){
//     const {encryptedRequest} = req.body;
//     const data = JSON.parse(crypto.decrypting(encryptedRequest));
//     console.log(data);
//     return data ; 
// }

// async function encryptCipher(input,res){
//     const data = 
// }

// generating JSON Web Token 
async function login (req,res){

    // console.log("reqqq  : ", req );
    // const privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKEVRVaMZwjT7KN0USfEUauEds7h4cY+llhUP3HVMsNqhh61E3uAPSgyBXxG+fuoIF9NKgOQq7U1jS+Evz/SB55VPkV/b5HBkl1v1eCWLItmKZuMZL6JfiSIt27ZYpeaoA+vcop1PyJf4pr8+9zth3MubqAkd0sWtef5eQpxZNljAgMBAAECgYAgsoejnNZhVVtIhpjeoJwPW9EeB33j1tp/zYIfYi5uulXFL+5neE1xtk2kv2eI7MS9c5VeqeQg4WDqT2De3IxNBNY3myUYGDktPPfiZubdtJtz0MWZB8LW12yKjadpRjVU6SGAd0yCEkytmp07DpJWImwoCw01LWDbszaf4qUaYQJBAPBHyxu6EUhWu9SazXAVfVgS5puk9GT3FkvXb8ZYKscaoYWl8Xx2UN26/KuUJMd2dk6JfrPwPkEhUPSLDXpC4fMCQQCrnxVkI1wnibHEsuEjaPbHuvuZabdLzn8FQMsEJY9qJl0fpllCbk7KBA7K0T1DAF3oB5FqRLtObkE6putBgpbRAkEAuxIqP9wNuJROiKg9ahZREFEm2ecDn9f/s+x3SaU7KOjC+JrJ+GzlaLw8HBmqyOCiG2NREibpUSvvK3VXeOi5oQJAdHtv6Fx7krZJOqjyV7dJL7zAQZrX9pK78ZPNdw4LLc/GCtI76PO3dDOW2p9zhgM8uVxRnR/zRUNd8HIUYI1C0QJAD494VB0C5I5J8lLQAxj/kZFNNKZZm1cysJRrlMZD5vzAE8z2+TT2eSH5QKsZggsykGPZfYEqu0e96gqDp+xq5g==";
    // const privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIBOgIBAAJBAJE4xf/Du9TTJEqrRRr0t8gnnxM4lrP9PfhTxn7VhJmCfjKBgeSKJfIBKhf4MDRauWAXnESThCrV+D/OtHhwRXcCAwEAAQJATXS1jqxMY8BWLAlbq3v5BiWz3+Gf59Jbmja8uWuS9Pjn1jfjX53UNlxxqvNeorNKTOlEuptAB8bptOAKdlrKsQIhAOCkNRriulkVTunxfS7O7dAzhy0Xrk5PxGvYhj5T7xEvAiEApX5sNHKnYcnGPJwt7xCAFZOCYfqeSHFukDD8qoERLjkCIQC607aa4p/KwO79n+rVyCF+u6wbs4sy9CJO8yhKo/G63wIgFkjs1y8tPOzHxfed89g79yvS3dC6qbSkl8QQ8gDJSHkCIDz2hRTKINaXATvo9zIUdK1ZBBKXJe/ZLnleImNduTQh-----END RSA PRIVATE KEY-----" ;
    // key.importKey(privateKey, 'pkcs8-private-pem');

    const jwtSecretKey = process.env.jwtSecretKey; 
    // console.log("middleware  : " , req.body); 

    const loginCredentials = req.body; 
    console.log("encrypted-- :  ", loginCredentials); 

    // const loginCredentials = JSON.parse(encrypted) ;

    console.log("login credentials : ", loginCredentials.email, loginCredentials.password); 
        // const {email , password} = req.query.q;
        // console.log("lc : ", email , password); 
    // const {encryptedRequest} = req.body;
    // const {username , email , password} =  JSON.parse(crypto.decrypting(encryptedRequest));
    // const decrypted = key.decrypt(encrypted, 'utf8');
    // console.log('decrypted: ', decrypted);
    // Decrypt the received login information
    // const email = key.decrypt(String(loginCredentials.email), 'utf8');
    // const password = key.decrypt(loginCredentials.password, 'utf8');

    console.log("decrypted email password :  ", email, password );

    const val = [email, password]; 
    const results = await queries.checkpass(val); 
    console.log(results);
    try{
        const hash = results.rows[0].password;
        if(bcrypt.compareSync(password, hash)){
            const token =  jwt.sign({username, email}, jwtSecretKey);
            return res.json(crypto.encrypting({username, token, msg : "login success "}));
            // encryptData;
        }
            return res.json({msg : "invalid credentials"});
    }catch(error){
        res.json({msg: 'user not registered . '})
    }    
  };

  // register admin here 

async function register(req, res){
    const {username ,email,  password , confirm_password } = req.body;
        // The bcrypt is used for encrypting password.
    // console.log(username ,email, password , confirm_password);
    if (password !== confirm_password){
        return res.status(500).json({msg: 'password and confirm_password doesn\'t match '});
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    // console.log(password, hashedPassword);
    //check if user already exists 
    try{
    const vals = [email];
    const resultss  = await queries.userExists(vals);
    // console.log(resultss, resultss.rows[0].exists_value);
    if(resultss.rows[0].exists_value === true){
       return res.json({msg : 'email already registered , try logging in or use another email'});
    } 

    
    const val = [username , email , hashedPassword];
    const results = await queries.registerUser(val); 
    console.log(val, results);
    return res.status(200).json({ username , email ,msg: 'user successfully registered'});
    }
    catch(error){
        throw error; 
    }
};

// function to change password 

async function changePass(req,res){
    const {username , email , oldPassword, newPassword , confirmNewPassword } = req.body ; 
    
    if (newPassword != confirmNewPassword){
        return res.status(500).json({msg: 'new password and confirm new password doesn\'t match '});}
    
    
    // const val = [username, email]; 
    const results = await queries.checkpass([username, email]); 
    const hash = results.rows[0].password;
    if(bcrypt.compareSync(oldPassword, hash) === false){
        return res.status(500).json({msg: "old password is not correct "});
    }

    if (oldPassword === newPassword){
        return res.status(500).json({msg: 'old password same as new password . '});}

    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    const val = [username , email , hashedPassword];
    // console.log(username , email , hashedPassword);
    try{
         const results = await queries.changePassword(val);
         res.status(200).json({username , msg: 'Password successfully changed. '});
    }catch(error){
        throw error; 
    }}
  

//validate token 
function validateToken (req,res ,next ) {
    const jwtSKey = process.env.jwtSecretKey;  
    console.log(jwtSKey);
    // console.log(req);
    const token = req.headers.authorization.split(' ')[1];
    // const token = req.headers.authorization;

    console.log(token);
    if (!token) 
    return res.status(403).json({ msg: "No token present" });

    try{
    const verified = jwt.verify(token, jwtSKey);
    // console.log('jwt token ', token);
    // const decoded_token = jwt.decode(token);
    // console.log('username : ', decoded_token.username);
    // console.log('id : ', decoded_token.id);
    if(verified){
        // return res.send("Successfully Verified");
        next();
    }else{
        return res.status(401).json({ msg: "invalid token hehe "});
    }
} catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: "Invalid token hehe " });
    } else {
        throw error;
    }}  
};


async function forgotPassword(req, res, next) {
    try {
        const email = req.body.email;
        const origin = req.header('Origin') || 'default-origin';
        const results = await queries.getUserByEmail([email]);
        console.log(' user :',  results.rows[0].username,"origin : ",  origin); 
        if(!results.rows[0].username){
            return res.json({status : 'OK '});
        }


        await queries.expireOldTokens([email, 1]);


        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60*60*1000);
        const createdAt = new Date(Date.now());
        const expiredAt = resetTokenExpires;

        await queries.insertResetToken([email,resetToken, createdAt, expiredAt, 0]);

        await sendPasswordResetEmail(email, resetToken, origin);
        res.json({msg: 'please check you email for a password '});

    }
    catch(error){
        throw error; 
    }
  
    };
    

// next();
// };

async function sendPasswordResetEmail(email, resetToken, origin){
    let message;

    if(origin){
        const resetUrl = `${origin}/apiRouter/resetPassword?token=${resetToken} email=${email}`;
        message = `<p>Please click the below link to reset your password, the following link will be valid for only 1 hour:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else { 
        message = `<p>Please use the below token to reset your password with the <code>/apiRouter/reset-password</code> api route:</p>
        <p><code>${resetToken}</code></p>`;
    }

    await sendEmail({
        from : process.env.EMAIL_FROM,
        to : "piyushpancholi@iitbhilai.ac.in",
        subject : 'reset your password',
 html: `<h4> Reset Password </h4> ${message}`

    });
}

async function sendEmail({to , subject , html, from = process.env.EMAIL_FROM}){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port : 587,
        auth : {
            user : process.env.USER ,
            pass : process.env.PASSWORD
        }
    })

    await transporter.sendMail({from, to, subject, html});
    console.log("email sent successfully ");
    res.status(200).json({msg: "email sent successfully. "});
};

// validate reset token 
async function validateResetToken ( req, res, next ){
    const email = req.body.email;
    const resetToken = req.body.token; 

    if(!resetToken || !email){
        return res.sendStatus(400);
    }

    const currentTime = new Date(Date.now());
    const token = await queries.findValidToken([resetToken, email, currentTime]);


    if(!token) {
        res.json('invalid token, please try again ');
}

next();
};

async function resetToken(req,res, next ){

    try {
        const newPassword = req.body.password ; 
        const email = req.body.email; 
        
        if(!newPassword){
            return res.sendStatus(400);
        }

        const user  = await queries.getUserByEmail([email]);
        const password = bcrypt.hashSync(newPassword, saltRounds);

        await queries.updateUserPassword([password , user.id]);

        res.json ({msg: 'password reset successful , you can now login with the new password '});
    } catch ( error ){
        throw error ; 
    }

};


module.exports= {
  resetToken, 
  validateResetToken,
  apiRouter,
  login,
  validateToken,
  register,
  changePass,
  forgotPassword,
  sendPasswordResetEmail
  };

