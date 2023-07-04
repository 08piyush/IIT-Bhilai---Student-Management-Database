const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());


mongoose.connect("mongodb://localhost:27017/studentDBM" ,{
    useNewUrlParser: true , 
    useUnifiedTopology : true 
}
     .then(( ) => console.log("connection successful..")) 
    .catch((err)=> console.log(err))
    )
// creating the schema to define the structure of object table which we would be using 
const studentSchema = new mongoose.Schema({
    studentid : {type : Number , required : true}, 
    firstname : String, 
    lastname : String, 
    doj : {type : Date, default : Date.now },
    contact : Number , 
    program : String
});

// creating the object / class 
const Student = new mongoose.model("Student",studentSchema);

//document 1 

const createStudent = async () => {
    try{

        const student1 = new Student({
            studentid : "34", 
            firstname : "iloh", 
            lastname : "cnap", 
            doj : 2002-02-25,
            contact : "6546546544" , 
            program : "Btech"
        })

        const student2 = new Student({
            studentid : "34", 
            firstname : "ilohhhh", 
            lastname : "cnap", 
            doj : 2002-02-25,
            contact : "6546546544" , 
            program : "Btech"
        })
        
        
    const results =  await Student.insertMany([student1, student2]);
    console.log(results);
    }catch(error){
        throw error;
    }
}

createStudent(); 

app.listen(3000 , ()=> {
    console.log("listen")
});