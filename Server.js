require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= MESSAGE MODEL ================= */

const Message = mongoose.model("Message", {

name:String,
email:String,
subject:String,
message:String,
createdAt:{
type:Date,
default:Date.now
}

});

/* ================= STATS MODEL ================= */

const Stats = mongoose.model("Stats", {

views:{
type:Number,
default:0
},

downloads:{
type:Number,
default:0
}

});

/* ================= CREATE DEFAULT STATS ================= */

async function createStats(){

const stats = await Stats.findOne();

if(!stats){

await Stats.create({
views:0,
downloads:0
});

}

}

createStats();

/* ================= CONTACT ================= */

app.post("/contact", async(req,res)=>{

try{

const {name,email,subject,message}
= req.body;

await Message.create({

name,
email,
subject,
message

});

res.json({
success:true
});

}catch(error){

console.log(error);

res.json({
success:false
});

}

});

/* ================= GET MESSAGES ================= */

app.get("/messages", async(req,res)=>{

try{

const messages =
await Message.find()
.sort({createdAt:-1});

res.json(messages);

}catch(error){

res.status(500).json({
error:"Server Error"
});

}

});

/* ================= DELETE MESSAGE ================= */

app.delete("/messages/:id", async(req,res)=>{

try{

await Message.findByIdAndDelete(
req.params.id
);

res.json({
success:true
});

}catch(error){

res.status(500).json({
success:false
});

}

});

/* ================= ADD VIEW ================= */

app.post("/add-view", async(req,res)=>{

try{

await Stats.updateOne(
{},
{
$inc:{
views:1
}
}
);

res.json({
success:true
});

}catch(error){

res.json({
success:false
});

}

});

/* ================= ADD DOWNLOAD ================= */

app.post("/add-download", async(req,res)=>{

try{

await Stats.updateOne(
{},
{
$inc:{
downloads:1
}
}
);

res.json({
success:true
});

}catch(error){

res.json({
success:false
});

}

});

/* ================= DASHBOARD STATS ================= */

app.get("/stats", async(req,res)=>{

try{

const stats =
await Stats.findOne();

const totalMessages =
await Message.countDocuments();

res.json({

views:stats.views,
downloads:stats.downloads,
messages:totalMessages,
projects:15

});

}catch(error){

res.status(500).json({
error:"Server Error"
});

}

});

/* ================= SERVER ================= */

app.listen(5000,()=>{

console.log(
"Server Running On Port 5000"
);

});
require("dotenv").config();

console.log(process.env.MONGO_URI);
console.log("MONGO_URI =", process.env.MONGO_URI);