const crypto = require('aes-ecb');
var keyString = 'KeyMustBe16ByteO';


exports.encrypting= function(data){
    try{
        console.log("data : ", data.body.encryptedRequest);
        const results =  crypto.encrypt(keyString, data.body.encryptedRequest);
        console.log("results : ",JSON.parse(results));
        next(results);
        // return results;
    }catch(error){
        throw error; 
    }
};

exports.decrypting= function(data){
    try{
        console.log("data : " , data.body.encryptedRequest);
        const results =  crypto.decrypt(keyString, data.body.encryptedRequest);
        console.log("results : ", JSON.parse(results));
        return JSON.parse(results);
    }catch(error){
        throw error; 
    }
};


