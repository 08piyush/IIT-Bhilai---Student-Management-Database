// w1
// const deleteAllData = 'delete from student where studentid = 5';
// const allStudentSubject = 'select id,subname,studentid,firstname from subject INNER JOIN student ON subject.id = ANY(student.courseids) order by id';
// const studentSubject = 'select subname from subject INNER JOIN student ON subject.id = ANY(student.courseids) where student.studentid = $1';
// w2
// const deleteAllData = (pool,res) =>{
//   pool.query( 'delete from student where studentid = 17',
//    (error, results)=>{
//     if(error){
//       throw error;
//     }
//   res.status(200).send('table has been emptied.')
//   });
// };

// with CALLBACKS
// const getAllStudentData =(val,cb)=> {
// que = 'SELECT * FROM student ORDER BY '+ val[0] +' ASC';
// pool.query(que,cb);
// };

//IGNORE THIS SECTION working 3
//w3
// const deleteAllData = (pool,res) =>{
//   pool.query( 'delete from student where studentid = 17',
//    (error, results)=>{
//     if(error){
//       throw error;
//     }
//   res.status(200).send('table has been emptied.')
//   });
// };

///////////////////////////////////////////////////////////////////////
const { pool } = require("../config/dbconnection");

async function getUserByEmail(val) {
  const que = {
    text: "select * from authenticate where email = $1",
    values: val,
  };

  return await pool.query(que);
}

async function insertResetToken(val) {
  const que = {
    text: "Insert into resetPasswordToken (email, token_value, created_at, expired_at, used) values($1, $2, $3, $4, $5) ",
    values: val,
  };
  return await pool.query(que);
}

async function expireOldTokens(val) {
  const que = {
    text: "update resetPasswordToken set used = $2 where email = $1 ",
    values: val,
  };

  return await pool.query(que);
}

async function findValidToken(val) {
  const que = {
    text: "select * from resetPasswordToken where  ( email = $1 and token_value = $2 and expired_at > $3)",
    values: val,
  };
  if (error) {
    return error;
  }
  return await pool.query(que);
}

async function updateUserPassword(val) {
  const que = {
    text: " update authenticate set password = $1 , where id= $2 ",
    values: val,
  };

  return await pool.query(que);
}

//check old password
async function changeOldPass(val) {
  const que = {
    text: "select password from authenticate where username = $1 and email = $2",
    values: val,
  };
  return pool.query(que);
}

//change password
async function changePassword(val) {
  // console.log(val)
  const que = {
    text: "update authenticate set password = $3 where username = $1 AND email = $2",
    values: val,
  };
  return await pool.query(que);
}

// if user already exists
async function userExists(vals) {
  // console.log(val);
  const que = {
    text: "SELECT EXISTS(SELECT 1 FROM authenticate WHERE email = $1) AS exists_value",
    values: vals,
  };
  return await pool.query(que);
}

//check if the username password mapping is correct and in database

async function checkpass(val) {
  const que = {
    text: "select password from authenticate where username = $1 and email = $2",
    values: val,
  };
  return pool.query(que);
}

// register user
async function registerUser(val) {
  // console.log(val);
  const que = {
    text: "INSERT INTO authenticate(username,email, password) values ( $1 , $2 , $3 )",
    values: val,
  };
  return await pool.query(que);
}

// get all students data with ASYNC AWAIT
async function getAllStudentData(val) {
  const que = "SELECT * FROM student ORDER BY " + val[0] + " ASC";
  return await pool.query(que);
}

// get single student data  by student id , async await
async function getStudentData(val) {
  const que = {
    text: "SELECT * FROM student WHERE studentid = $1",
    values: val,
  };
  return await pool.query(que);
}

// add student async await
async function addStudent(val) {
  const que = {
    text: "INSERT INTO student ( firstname, lastname, doj,program, contact, courseids) VALUES ($1, $2, $3, $4,$5, $6) RETURNING studentid",
    values: val,
  };
  return await pool.query(que);
}

// update student async await
async function updateStudent(val) {
  const que = {
    text: "UPDATE student SET firstname = $1, lastname= $2, doj= $3, program= $4, contact= $5  , courseids = $6 WHERE studentid = $7",
    values: val,
  };
  return await pool.query(que);
}

//delete Student async await
async function deleteStudent(val) {
  console.log("fetched sid into queries.js : ", val);
  const que = {
    text: "DELETE FROM student WHERE studentid = $1",
    values: val,
  };

  console.log("query : ", que);

  return await pool.query(que);
}

// delete all data async await
async function deleteAllData(val) {
  const que = "truncate table student restart identity";
  return await pool.query(que);
}

//all student subject with callback
const allStudentSubject = (val, cb) => {
  const que =
    "select id,subname,studentid,firstname from subject INNER JOIN student ON subject.id = ANY(student.courseids) order by id";
  pool.query(que, cb);
};

// student subject using callback
const studentSubject = (val, cb) => {
  const que = {
    text: "select subname from subject INNER JOIN student ON subject.id = ANY(student.courseids) where student.studentid = $1",
    values: val,
  };
  pool.query(que, cb);
};

// exporting all necessary queries explicitly
module.exports = {
  findValidToken,
  updateUserPassword,
  insertResetToken,
  expireOldTokens,
  getUserByEmail,
  changeOldPass,
  userExists,
  registerUser,
  checkpass,
  changePassword,
  getAllStudentData,
  getStudentData,
  addStudent,
  updateStudent,
  deleteStudent,
  deleteAllData,
  allStudentSubject,
  studentSubject,
};

//EOL
