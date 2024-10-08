const Week = require('../schema/weeks');
const Days = require('../schema/days');
const jwt = require('jsonwebtoken');
const user = require('../schema/users');

const Weeks = async (req, res) => {
    try {
        const dayElements = req.body;  // Array of day elements
        for (const dayElement of dayElements) {
            // this is a for loop it takes the array of day that the user send from the frontend and return it on one object that you can minapulate it 
            let week = await Week.findOne({
                userScadual: { $all: [dayElement.id] }
            }); // this function to get the specific day element 
            if (!week) {
                week = await Week.create({
                    userScadual: [dayElement.id]
                });// this function if theres no week with the user id it creates a new array of the week
            }
                const day = new Days({
                    userScadual: [dayElement.id],
                    dayName:dayElement
                }); // this function to create a day with the array that you put into it, the userScadual puts the id of the day schema & ans the dayName puts the dayElements that you made it
                // await day.save();
            
            if (day) {
                week.week1.push(day._id);
            }// if theres a day push the day id into it
            await week.save();
            await day.save();
            
        }
        res.status(200).json(dayElements)
    } catch (error) {
        console.log("Error in SendDate controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllDays = async (req,res) => {
    try{
        const GetDays = await Days.find({})
        res.status(200).json(GetDays)
    }
    catch(error){
        res.status(400).json({message:"Sorry This Page Only For Admins"})
    }
}// get all days
const getMyDays = async (req,res) => {
    // const {id} = req.params
    const { authorization } = req.headers
    // we get the token from the authorization user
    const token = authorization.split(' ')[1]
    // we split it into half and get the secound index
    const {_id} = jwt.verify(token, process.env.KEY)
    // we verify the token that we get it from the user and compare it to the key that we passed in
    req.user = await user.findOne({_id}).select("_id")
    // when it's true we can get the id of the user from the token successfully
    try{
        const myId = req.user._id
        // we get request the id user
        const getWeeks = await Week.findOne({
            userScadual:{$all:[myId]}
        }).populate('week1')
        // we find the week of the user by id
        if(!getWeeks){
            return res.status(200).json([])
            // if theres no week or days we get nothing
        }else{
            const getDays = getWeeks.week1
            res.status(200).json(getDays)
            // if theres a week we send it to the frontend
        }
    }
    catch(error){
        console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
}// this function for get user dates
const getMyDaysScadualSettings = async (req,res) => {
    const {id} = req.params
    // we get the id from the request post&&get link
    const { authorization } = req.headers
    // we get the token from the authorization user
    const token = authorization.split(' ')[1]
    // we split it into half and get the secound index
    const {_id} = jwt.verify(token, process.env.KEY)
    // we verify the token that we get it from the user and compare it to the key that we passed in
    req.user = await user.findOne({_id}).select("_id")
    // when it's true we can get the id of the user from the token successfully
    try{
        const getWeeks = await Week.findOne({
            userScadual:{$all:[id]}
        }).populate('week1')
        // we find the week of the user by id

        if(!getWeeks){
            return res.status(200).json([])
            // if theres no week or days we get nothing

        }else{
            const getDays = getWeeks.week1
            res.status(200).json(getDays)
            // if theres a week we send it to the frontend

        }
    }
    catch(error){
        console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
}
const deleteScadual = async (req, res) => {
    const {id} = req.params
    // we get the id from the request post&&get link

    try{
        const deletes = await Days.findByIdAndDelete({_id:id})
        // if the id matches it deletes the date
        return res.json(deletes)
        // if it's successfully it send it to the frontend
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}
const updateScadual = async (req, res) => {
    const {updatedDate} = req.body
    // we get the array from the frontend
    const {id} = req.params
    // we get the id from the request post&&get link
    try{
        await Days.findByIdAndUpdate({_id:id},{ dayName: updatedDate})
            // if the id matches it Updates the date
        res.status(200).json({message:'Update completed'})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}
module.exports = { Weeks,getAllDays,getMyDays,getMyDaysScadualSettings,deleteScadual,updateScadual };
