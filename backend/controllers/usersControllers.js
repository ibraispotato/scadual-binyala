const mongoose = require('mongoose');
const User = require('../schema/users')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const validator = require('validator')

const createToken = (_id) => {
    return jwt.sign({_id},process.env.KEY,{expiresIn:"30d"})
}

const signUp = async (req,res) => {
    const {email,password,FirstName,LastName} = req.body
        // we get the email & password & firstName & LastName from the frontend
    try{
        const profilePic = 'https://res.cloudinary.com/dyoy5gl6a/image/upload/v1723572482/qf1z3syzesgzc6oeianl.png'
        // the is for profile picture the send it to the schema user
        const user = await User.signUp(email,password,FirstName,LastName,profilePic)
        // this function to send the email & password & firstName & LastName to the schema user
        const token = createToken(user._id)
        // this function to create a token
        const admin = user.admin
        // this function to get the admin from the schema user
        const pas = user.password
        // this function to get the password from the schema user
        res.status(200).json({email,FirstName,LastName,token,profilePic,admin,pas})
        // here for sending the information to the frontend
    }
    catch(err) {
        res.status(400).json({message:err.message})
    }
}
const login = async (req,res) => {
    const {email,password} = req.body
        // we get the email & password from the frontend

    try{
        const user = await User.logIn(email,password)
        // this function the send the email & password to the schema to get the information user to login to the account
        const token = createToken(user._id)
        // this function to create a token

        /// these functions to get some of the informations to send it to the frontend
        const admin = user.admin
        const profilePic = user.profilePic
        const LastName = user.LastName
        const FirstName = user.FirstName
        const pas = user.password
        res.status(200).json({email,token,profilePic,admin,LastName,FirstName,pas})
    }
    catch(err) {
        res.status(400).json({message:err.message})
    }
}

const forgetPassword = async (req,res) => {
    const { email } = req.body
    // we get the email from the frontend
    try {
        const users = await User.forgetPassword(email)
        // now we send the email to the function on the schema
        const token = jwt.sign({_id: users._id},process.env.KEY,{expiresIn:"5m"})
        // this function creates a token and compare it to the key that the web dev includes and the token expires in 5 minuts
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ibrapotato@gmail.com',
                pass: 'bjyz hylf ehzf yhse'
                }
            });
            
            var mailOptions = {
                from: 'ibrapotato@gmail.com',
                to: email,
                subject: 'reset password',
                text: `http://localhost:3000/resetPassword/${token}`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.json({message:"error sending email"})
                } else {
                    return res.json({status:true, message:"Check your Email"})
                }
            });
    }
    catch (err) {
        res.status(400).json({ error: err })

    }
}
const reset = async (req,res)=> {
    const {token} = req.params
    // we get the token from the Paramas API
    const {password} = req.body
    // we get the password from the frontend
    try{
        const dec = jwt.verify(token,process.env.KEY)
        // now here we verify the token and the key
        const id = dec._id
        // when the key and the token has been verified we get the id of the user
        const salt = await bcrypt.genSalt(10)
        // we make an Gen Salt to make the password safe
        const hash = await bcrypt.hash(password,salt)
        // here we make the hash that to body knows about the password
        await User.findByIdAndUpdate({_id:id},{password:hash})
        // finally we use the findByIdAndUpdate here we included the id of the user and the hash password that we made
        return res.json({status:true,message:"update"})
    }
    catch(error) {
        return res.json("error")
    }
}
const getallUsers = async (req,res) => {
    try{
        const users = await User.find({})
        // this function to get all the users        
        res.status(200).json(users)
        // here we send all the users to the frontend
    }
    catch(err){
        res.status(400).json({message:err.message})

    }
}
const getOneUser = async (req,res) => {
    const { authorization } = req.headers
    // we get the token from the authorization user
    const token = authorization.split(' ')[1]
    // we split it into half and get the secound index
    const {_id} = jwt.verify(token, process.env.KEY)
    // we verify the token that we get it from the user and compare it to the key that we passed in
    req.user = await User.findOne({_id}).select("_id")
    // when it's true we can get the id of the user from the token successfully
    try{
        const myId = req.user._id
        // we get request the id user
        const users = await User.findOne({_id:myId})
        // here we use the findOne function to get one user by the id
        res.status(200).json(users)
        // finally we send the user to the frontend
    }
    catch(error){
        res.status(400).json({message:err.message})

    }
}
const editUserDetails = async (req,res) => {
    const {email,password,FirstName,LastName} = req.body
        // we get the email & password & firstName & LastName from the frontend
    const { authorization } = req.headers
    // we get the token from the authorization user
    const token = authorization.split(' ')[1]
    // we split it into half and get the secound index
    const {_id} = jwt.verify(token, process.env.KEY)
    // we verify the token that we get it from the user and compare it to the key that we passed in
    req.user = await User.findOne({_id}).select("_id")
    // when it's true we can get the id of the user from the token successfully
    try{
        const myId = req.user._id
        // we get request the id user
        if(email !== ""){
            // here in the if condition we check if the email has been written
            if (!validator.isEmail(email)) {
                throw Error("email must be a valid")
            }// inside the if condition we got an other condition and we check if theres an email with the email that you have been written
            else{
            await User.findOneAndUpdate({_id:myId},{email:email})
            }//here we got an else, if he has been written the email we provide the findOneAndUpdate with an id and the new email
        }
         if(FirstName !==""){
            // here in the if condition we check if the FirstName has been written
            await User.findOneAndUpdate({_id:myId},{FirstName:FirstName})
            // here we use findOneAndUpdate and provide the id of the user and the new first name
        }
         if(LastName !==""){
            // here in the if condition we check if the LastName has been written
            await User.findOneAndUpdate({_id:myId},{LastName:LastName})
            // here we use findOneAndUpdate and provide the id of the user and the new last name
        }
        if(password !== ""){
            // here in the if condition we check if the Password has been written
            if(!validator.isStrongPassword(password)){
                throw new Error("Password must be strong")
                // inside the if condition we got an other condition and we check if the password is strong or not
            }
        else{
        const dec = jwt.verify(token,process.env.KEY)
        // now here we verify the token and the key
        const id = dec._id
        // when the key and the token has been verified we get the id of the user
        const salt = await bcrypt.genSalt(10)
        // we make an Gen Salt to make the password safe
        const hash = await bcrypt.hash(password,salt)
        // here we make the hash that to body knows about the password
        await User.findOneAndUpdate({_id:id},{password:hash})
        // finally we use the findByIdAndUpdate here we included the id of the user and the hash password that we made
        }
        
        }
        return res.json({status:true,message:"update"})
    }
    catch(error){
        res.status(400).json({message:error.message})

    }
}

module.exports = {signUp,login,forgetPassword,reset,getallUsers,editUserDetails,getOneUser}