const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const path = require('path')
const connectDb = require('./config/connectDB')

//config dot env file
dotenv.config();

//databse
connectDb();

//rest object
const app = express()

//middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

//routes
//user routes
app.use("/api/v1/users",require("./routes/userRoute"));

//transcation routes
app.use("/api/v1/transactions",require("./routes/transactionRoute"));

//static files
app.use(express.static(path.join(__dirname,"./client/dist")))
app.get('*',function(req,res){
   res.sendFile(path.join(__dirname,"./client/dist/index.html")) 
})

//port
const PORT =  process.env.PORT || 8080;

//listen server
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})