//jshint esversion:6
const express= require("express");
const bodyParser=require("body-parser");
const mysql=require("mysql");
const pushDataDb=[];

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

app.get("/",function(req,res){

res.render("index");
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
    mStatus:req.body.userStatusInput,
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

  res.redirect("/registration");

});
});

app.listen(3000,function(){console.log("server started on port 3000 succesfully");});
