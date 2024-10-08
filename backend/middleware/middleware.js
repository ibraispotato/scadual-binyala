const jwt = require('jsonwebtoken')
const User = require('../schema/users')

const Auth = async (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(400).json({message:"Invalid authorization"})
    }
    const token = authorization.split(' ')[1]
    try{
        const {_id} = jwt.verify(token,process.env.KEY)
        req.user = await User.findOne({_id}).select("_id")
        next()
    }
    catch(error){
        return res.status(401).json({error: 'Invalid token'})
    }
}