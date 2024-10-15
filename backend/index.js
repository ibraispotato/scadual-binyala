require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const serverless = require("serverless-http")
const express = require('express')
const users = require('./routes/userRoutes')
const Scadual = require('./routes/scadualRoutes')
const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'build')));

app.use(cors()); // Allow all origins


app.use(express.json())
app.use((req,res,next) => {
    console.log(req.path , req.method)
    next();
})
app.use('/binYala/users/',users)
app.use('/binYala/Scadual',Scadual)
mongoose.connect(process.env.MONGOURI).then(() => {
    app.listen(process.env.PORT||4000, () => {
        console.log('listening on '+process.env.PORT||4000)
    })
    // module.exports.handler = serverless(app);

}).catch((err) => console.error(err))