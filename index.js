const { default: colors } = require("colors")
const express  = require("express")
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')

dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Database connect'.yellow)).catch((err)=>console.log(err.yellow))

app.use(express.json())
app.use("/api",authRoute)
app.use("/api",userRoute)




app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Started".yellow)

})









// let a = 20;
// let b = 30;

 

// let waitForTime = new Promise((res,reject)=>{
//     setTimeout(()=>{
//         res("success");
//      },5000)
    
// })

// waitForTime.then((data)=>{
//    if(data == 'success'){
//     console.log("Successfully you are logged in");
//    }else{
//     console.log("Sorry you are not able to login");
//    }
// })









// http.createServer( (req,res)=>{
// console.log("Server start".america)
//     res.writeHead(200,{'content-Type':'Application/json'});
//     res.write(JSON.stringify(data));
//     res.end();

// }).listen(5000);
