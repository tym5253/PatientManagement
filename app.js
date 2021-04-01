//jshint esversion:6
const express= require("express");
const bodyParser=require("body-parser");
const mysql=require("mysql");

const app=express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tahaym@5253"
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

app.listen(3000,function(){console.log("server started on port 3000 succesfully");});
