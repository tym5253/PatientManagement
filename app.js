//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
let pushDataDb = [];
let updateDataDB = [];
let appointDataDb = [];
let consultDataDb=[];

let searchdisplay = {};
let displayPatient = {};
let updatePatient = {};
let updatePatientId = "";
let appPatientID = "";
var datetime = new Date();
let date=datetime.toISOString().slice(0,10);

let appointPatientDetails = {};
let appointDoctorDetails = {};
let consultPatientDetails={};
const app = express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tahaym@5253",
  database: "pms"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected database");
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/newAppointment", function(req, res) {

  con.query("SELECT doctor_name FROM doctor_details", function(err, result, fields) {
    appointDoctorDetails = result;
  });

  res.render("newAppointment", {
    fetchPatientDetails: appointPatientDetails,
    fetchdocDetails: appointDoctorDetails,
    fetchDate:date
  });
});

app.post("/appointment",function(req,res){

let dateSearch=req.body.searchInput;
con.query("SELECT * FROM appointments where date='"+dateSearch+"' order by date,time", function(err, result, fields) {
  res.render("appointment", {
    display: result
  });
});
});

app.post("/newAppointment", function(req, res) {

  let appointmentData = {
    patient_id: req.body.patientIdInput,
    patient_name: req.body.patientNameInput,
    patient_number: req.body.patientMobNoInput,
    doctor_name: req.body.doctorNameInput,
    date: req.body.appDateInput,
    time: req.body.appTimeInput,
    token_no: req.body.appTokenInput,
    comments: req.body.appCommentsInput
  };


  for (let key in appointmentData) {
    if (appointmentData.hasOwnProperty(key)) {
      value = appointmentData[key];
      appointDataDb.push(value);
    }
  }

  let sql="INSERT INTO `pms`.`appointments`(`appointment_id`,`patient_id`,`patient_name`,`patient_number`,`doctor_name`,`date`,`time`,`token_no`,`comments`)VALUES(default,?,?,?,?,?,?,?,?);";

  con.query(sql, appointDataDb, function(err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
  appointDataDb=[];
  res.redirect("/appointment");
});

app.post("/newAppointment/patient", function(req, res) {
  appPatientID = req.body.patientSearch;
  if (!isNaN(appPatientID)) {
    con.query("SELECT patient_id,patient_name,patient_mobile FROM patient_details where patient_id='" + appPatientID + "'", function(err, result, fields) {
      appointPatientDetails = result;
    });
  } else {
    con.query("SELECT patient_id,patient_name,patient_mobile FROM patient_details where patient_name like'%" + appPatientID + "%'", function(err, result, fields) {
      appointPatientDetails = result;
    });
  }
  res.redirect("/newAppointment");
});

app.get("/appointment", function(req, res) {


console.log(date);
  con.query("SELECT * FROM appointments where date='"+date+"' order by date,time", function(err, result, fields) {
    res.render("appointment", {
      display: result
    });
    console.log(result);
  });

});

app.post("/appointment/delete",function(req,res){
  let deleteRow = req.body.buttonClickedDelete;
  var sql = "DELETE FROM appointments WHERE appointment_id ='" + deleteRow + "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.redirect("/appointment");
});

app.post("/appointment/update",function(req,res){

  let updateRow=req.body.buttonClickedUpdate;
  let sql="UPDATE `pms`.`appointments` SET status ='Done' WHERE `appointment_id` ="+updateRow+";";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.redirect("/appointment");
});

app.get("/patientHistory", function(req, res) {
  res.render("patientHistory");
});

app.get("/consultation", function(req, res) {

  res.render("consultation",{fetchPatientDetails: consultPatientDetails,
    fetchDate:date});
});

app.post("/consultation",function(req,res){

  let userData = {
    patient_id: req.body.patientIdInput,
    patient_name:req.body.patientNameInput,
    doctor_id: req.body.doctorIdInput,
    app_date: req.body.appDateInput,
    payment_due: req.body.conPayInput,
    problem: req.body.problemInput,
    appointment_id: req.body.appIdInput
  };

  for (let key in userData) {
    if (userData.hasOwnProperty(key)) {
      value = userData[key];
      consultDataDb.push(value);
    }
  }

  let sql = "INSERT INTO `pms`.`consultation`(`consult_id`,`patient_id`,`patient_name`,`doctor_id`,`app_date`,`payment_due`,`problem`,`appointment_id`)VALUES(default,?,?,?,?,?,?,?);";

  con.query(sql, consultDataDb, function(err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
  res.redirect("/");

});
app.post("/consultation/patient", function(req, res) {
  appPatientID = req.body.patientSearch;
    con.query("SELECT appointment_id,patient_id,patient_name,date FROM appointments where appointment_id=" + appPatientID, function(err, result, fields) {
      consultPatientDetails = result;
    });
  res.redirect("/consultation");
  consultPatientDetails={};
});

app.get("/patientDisplay", function(req, res) {


  con.query("SELECT * FROM patient_details", function(err, result, fields) {
    res.render("patientDisplay", {
      display: result
    });
  });
});

app.get("/doctordisplay", function(req, res) {

  con.query("SELECT * FROM doctor_details", function(err, result, fields) {
    res.render("doctordisplay", {
      docDetails: result
    });
  });
});

app.post("/patientDisplay", function(req, res) {


  let search = req.body.searchInput;
  if (!isNaN(search)) {
    con.query("SELECT * FROM patient_details where patient_id='" + search + "'", function(err, result, fields) {
      res.render("patientDisplay", {
        display: result
      });
    });
  } else {
    con.query("SELECT * FROM patient_details where patient_name like'%" + search + "%'", function(err, result, fields) {
      res.render("patientDisplay", {
        display: result
      });
    });
  }
});

app.post("/patientDisplay/delete", function(req, res) {

  let deleteRow = req.body.buttonClickedDelete;
  var sql = "DELETE FROM patient_details WHERE patient_id ='" + deleteRow + "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.redirect("/patientDisplay");
});

app.post("/patientHistory",function(req,res){



let search = req.body.buttonClickedHistory;
  con.query("SELECT * FROM consultation where patient_id='" + search + "' order by app_date", function(err, result, fields) {
    res.render("patientHistory", {
      display: result
    });
  });
});

app.get("/registration", function(req, res) {
  res.render("registration");
});

app.post("/registration", function(req, res) {

  let userData = {
    name: req.body.userNameInput,
    mobileNum: req.body.userCcInput + req.body.userMobNoInput,
    address: req.body.userAddressInput,
    country: req.body.userCountryInput,
    state: req.body.userStateInput,
    city: req.body.userCityInput,
    zipcode: req.body.userZipInput,
    gender: req.body.userGenderInput,
    dob: req.body.userDobInput,
    bloodgrp: req.body.userBgroupInput,
    insurance: req.body.userInoInput,
    insexpdt: req.body.userExpDateInput,
    mStatus: req.body.userStatusInput
  };

  for (let key in userData) {
    if (userData.hasOwnProperty(key)) {
      value = userData[key];
      pushDataDb.push(value);
    }
  }

  let sql = "INSERT INTO `patient_details`(`patient_id`,`patient_name`,`patient_mobile`,`patient_address`,`patient_country`,`patient_state`,`patient_city`,`zipcode`,`gender`,`patient_DOB`,`patient_blood`,`patient_insurance`,`patient_insexp`,`patient_mstatus`)VALUES(default,?,?,?,?,?,?,?,?,?,?,?,?,?);";
  con.query(sql, pushDataDb, function(err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
  pushDataDb=[];
  res.redirect("/patientDisplay");
});

app.get("/update", function(req, res) {

  con.query("SELECT * FROM patient_details where patient_id='" + updatePatientId + "'", function(err, result, fields) {
    res.render("update", {
      displayRec: result
    });
  });
});

app.post("/update", function(req, res) {
  updatePatientId = req.body.buttonClickedUpdate;
  res.redirect("/update");
});

app.post("/update/record", function(req, res) {

  let userData = {
    name: req.body.userNameInput,
    mobileNum: req.body.userCcInput + req.body.userMobNoInput,
    address: req.body.userAddressInput,
    country: req.body.userCountryInput,
    state: req.body.userStateInput,
    city: req.body.userCityInput,
    zipcode: req.body.userZipInput,
    gender: req.body.userGenderInput,
    dob: req.body.userDobInput,
    bloodgrp: req.body.userBgroupInput,
    insurance: req.body.userInoInput,
    insexpdt: req.body.userExpDateInput,
    mStatus: req.body.userStatusInput
  };

  for (let key in userData) {
    if (userData.hasOwnProperty(key)) {
      value = userData[key];
      updateDataDB.push(value);
    }
  }

  var sql = "UPDATE patient_details SET patient_name =?, patient_mobile=?, patient_address=?,patient_country=?,patient_state=?,patient_city=?,zipcode=?,gender=?,patient_DOB=?,patient_blood=?,patient_insurance=?,patient_insexp=?,patient_mstatus=? WHERE patient_id = '" + updatePatientId + "'";
  con.query(sql, updateDataDB, function(err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  updateDataDB = [];
  res.redirect("/patientDisplay");

});

app.listen(3000, function() {
  console.log("server started on port 3000 succesfully");
});
