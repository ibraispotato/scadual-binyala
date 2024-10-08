const express = require('express')
const {Weeks,getAllDays,getMyDays,getMyDaysScadualSettings,deleteScadual,updateScadual} = require('../controllers/scadualController')
const route = express.Router()

route.post('/sendWeeksAndDays',Weeks)
route.get('/GetAllDays',getAllDays)
route.get('/getMyDays',getMyDays)
route.get('/getMyDaysScadualSettings/:id',getMyDaysScadualSettings)
route.delete('/deleteScadual/:id',deleteScadual)
route.put('/updateDay/:id',updateScadual)
module.exports = route