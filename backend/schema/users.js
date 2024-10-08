const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')


const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
})
userSchema.statics.signUp = async function (email,password,FirstName,LastName,profilePic,admin){
    // here we get the email & password & firstName & LastName & profilePic & admin from the userController
    if(!email||!password){
        // here in the if statement if theres no email or password we send an error You must provide the inputs
        throw new Error("You must provide the inputs")
    }
    const user = await this.findOne({email})
    // if he provide an email we check if theres the same email
    if(user){
        // if theres an email we send an error
        throw new Error("Email already exists")
    }
    // if theres no email with the email that the user provided 
    if(!validator.isEmail(email)){
        // now we check if the email is valid
        throw new Error("Email must be valid")
    }
    if(!validator.isStrongPassword(password)){
        // here we check if the password is strong
        throw new Error("Password must be strong")
    }
    const salt = await bcrypt.genSalt(10)
        // we make an Gen Salt to make the password safe
    const hashedPassword = await bcrypt.hash(password,salt)
        // here we make the hash that to body knows about the password
    const users = await this.create({email,password:hashedPassword,FirstName,LastName,profilePic,admin})
    // finally we create an new account with this information
    return users
}
userSchema.statics.logIn = async function (email,password){
    // here we get the email & password from the userController
    if(!email||!password){
        // here in the if statement if theres no email or password we send an error You must provide the inputs
        throw new Error("You must provide the inputs")
    }

    const user = await this.findOne({email})
    // if he provide an email we check if theres the same email
    if(!user){
        // if it dosent find the same email that the user provided it will send an error
        throw new Error("Email not found")
    }
    const compare = await bcrypt.compare(password,user.password)
    // here we make a compare between the password that the user included and the password of the account
    if(!compare){
        // if theres no compare we send an error
        throw new Error("Password is incorrect")
    }
    return user
}
userSchema.statics.forgetPassword = async function (email){
    // here we get the email from the userController
    if(!email){
        // here in the if statement if theres no email we send an error You must provide the inputs
        throw Error("Email must be filled")
    }
    const user = await this.findOne({email})
    // if he provide an email we check if theres the same email
    if(!user){
        // if it dosent find the same email that the user provided it will send an error
        throw Error("incorrect email")
    }
    if (!validator.isEmail(email)) {
        // now we check if the email is valid
        throw Error("email must be a valid")
    }
    return user
}
module.exports = mongoose.model("userSchema",userSchema)
