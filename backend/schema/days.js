const mongoose = require('mongoose')
const Days = require('../schema/days')
const Schema = mongoose.Schema

const daysSchema = new Schema({
    
    userScadual:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    dayName:{
        type:Array,
        // ref:"User",
        default:[],
    }
})

module.exports = mongoose.model('days',daysSchema)