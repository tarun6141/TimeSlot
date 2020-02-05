const express = require('express')
const ctr = require('./controller')
var app = express()
const bodyParser = require('body-parser')
//const cors = require('cors')
//app.use(cors)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/timeSlots',ctr.getTimeSlots)
app.post('/timeSlots',ctr.postTimeSlot)

app.listen(4000,()=>{
    console.log("sever running on port - 4000")
})


