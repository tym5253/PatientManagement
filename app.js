//jshint esversion:6
const express= require("express");
const bodyParser=require("body-parser");
const mysql=require("mysql");
const pushDataDb=[];
let updateDataDB=[];
const pushLoginDataDB=[];

let searchdisplay={};
let displayPatient={};
let updatePatient={};
let updatePatientId="";

const app=express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tahaym@5253",
  database:"pms"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected database");
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.get("/",function(req,res){
res.render("index");
});



app.get("/appointment",function(req,res){
res.render("appointment");
});

app.get("/tests",function(req,res){
res.render("tests");
});

app.get("/consultation",function(req,res){
res.render("consultation");
});

app.get("/patientDisplay",function(req,res){


  con.query("SELECT * FROM patient_details", function (err, result, fields) {
    res.render("patientDisplay",{display:result});
  });
});

app.post("/patientDisplay",function(req,res){


let search=req.body.searchInput;
if(!isNaN(search))
{
  con.query("SELECT * FROM patient_details where patient_id='"+search+"'", function (err, result, fields) {
  res.render("patientDisplay",{display:result});
  });
}
else
{
  con.query("SELECT * FROM patient_details where patient_name like'%"+search+"%'", function (err, result, fields) {
  res.render("patientDisplay",{display:result});
  });
}
});

app.post("/patientDisplay/delete",function(req,res){

  let deleteRow=req.body.buttonClickedDelete;
  var sql = "DELETE FROM patient_details WHERE patient_id ='"+deleteRow+"'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted: " + result.affectedRows);
});
res.redirect("/patientDisplay");
});

app.get("/registration",function(req,res){
res.render("registration");
});

app.post("/registration",function(req,res){

    let userData={name:req.body.userNameInput,
    mobileNum:req.body.userCcInput+req.body.userMobNoInput,
    address:req.body.userAddressInput,
    country:req.body.userCountryInput,
    state:req.body.userStateInput,
    city:req.body.userCityInput,
    zipcode:req.body.userZipInput,
    gender:req.body.userGenderInput,
    dob:req.body.userDobInput,
    bloodgrp:req.body.userBgroupInput,
    insurance:req.body.userInoInput,
    insexpdt:req.body.userExpDateInput,
    mStatus:req.body.userStatusInput
  };

  for(let key in userData){
    if (userData.hasOwnProperty(key))
                {
                    value = userData[key];
                    pushDataDb.push(value);
                }
            }

let sql="INSERT INTO `patient_details`(`patient_id`,`patient_name`,`patient_mobile`,`patient_address`,`patient_country`,`patient_state`,`patient_city`,`zipcode`,`gender`,`patient_DOB`,`patient_blood`,`patient_insurance`,`patient_insexp`,`patient_mstatus`)VALUES(default,?,?,?,?,?,?,?,?,?,?,?,?,?);";
  con.query(sql, pushDataDb, function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
  res.redirect("/registration");
});

app.get("/update",function(req,res){

  con.query("SELECT * FROM patient_details where patient_id='"+updatePatientId+"'", function (err, result, fields) {
  res.render("update",{displayRec:result});
  });
});

app.post("/update",function(req,res){
      updatePatientId=req.body.buttonClickedUpdate;
      res.redirect("/update");
});

app.post("/update/record",function(req,res){

  let userData={name:req.body.userNameInput,
  mobileNum:req.body.userCcInput+req.body.userMobNoInput,
  address:req.body.userAddressInput,
  country:req.body.userCountryInput,
  state:req.body.userStateInput,
  city:req.body.userCityInput,
  zipcode:req.body.userZipInput,
  gender:req.body.userGenderInput,
  dob:req.body.userDobInput,
  bloodgrp:req.body.userBgroupInput,
  insurance:req.body.userInoInput,
  insexpdt:req.body.userExpDateInput,
  mStatus:req.body.userStatusInput
};

for(let key in userData){
  if (userData.hasOwnProperty(key))
              {
                  value = userData[key];
                  updateDataDB.push(value);
              }
          }

          var sql = "UPDATE patient_details SET patient_name =?, patient_mobile=?, patient_address=?,patient_country=?,patient_state=?,patient_city=?,zipcode=?,gender=?,patient_DOB=?,patient_blood=?,patient_insurance=?,patient_insexp=?,patient_mstatus=? WHERE patient_id = '"+updatePatientId+"'";
        con.query(sql,updateDataDB, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
        updateDataDB=[];
        res.redirect("/patientDisplay");

});

app.listen(3000,function(){console.log("server started on port 3000 succesfully");});
