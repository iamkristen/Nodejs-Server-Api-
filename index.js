const { default: colors } = require("colors")
const express  = require("express")
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')

dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Database connect'.yellow)).catch((err)=>console.log(err.yellow))

app.use(express.json())
app.use("/api",authRoute)
app.use("/api",userRoute)
app.use("/api",productRoute)




app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Started".yellow)

})
