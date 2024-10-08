const mongoose = require('mongoose')
const SchemaWeek = mongoose.Schema


const weeksSchema = new SchemaWeek({
    userScadual:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    week1:
    [{
        type:mongoose.Schema.Types.ObjectId,
        default:[],
        ref:"days"
    }],
    
},{timestamps:true})
module.exports = mongoose.model("weeksSchema",weeksSchema)