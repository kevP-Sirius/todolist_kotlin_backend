var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 9001;
app.use(cors())
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");
var nodemailer = require('nodemailer');
const axios = require('axios');
const qs = require('qs');
const moduleGenerator = require("./controller/login");
app.use(bodyParser.json());
let dbUrl="mongodb://admin:eecbcdb9f950087b66a@localhost:27017/?authMechanism=DEFAULT"
if(process.env.ENV=="prod"){
  dbUrl="mongodb://admin:eecbcdb9f950087b66a@mongodb-service.todolist-application.svc.cluster.local:27017/?authMechanism=DEFAULT"
}

let hashIt = async(password)=>{
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed
}

transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "email-smtp.eu-west-3.amazonaws.com",
      auth: {
          user: process.env.userAWS,
          pass: process.env.passAWS,
          },
  secure: true,
  });

MongoClient.connect(dbUrl, function(err, client) {
  if (err) {
    throw err;
  }
  db = client.db("todolist_kotlin");
});
app.listen(port, () => {
  console.log(`mode : ${process.env.ENV}`)
  console.log(`Example app listening on port ${port}`)
})
app.post('/login',async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let moduleGenerator = require('./controller/login/index.js');
  await moduleGenerator.moduleRoute(req,res,ObjectId,db,moment,transporter,hashIt,axios,qs)
})
app.post('/register',async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let moduleGenerator = require('./controller/register/index.js');
  await moduleGenerator.moduleRoute(req,res,ObjectId,db,moment,transporter,hashIt,axios,qs)
})

