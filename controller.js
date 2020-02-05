var models = require('./models')

let getTimeSlots = (req,res)=>{
    models.getTimeSlots()
    .then(respData=>{
        res.send(respData)
    }).catch(err=>{
        res.send(err)
    })
}
let postTimeSlot = (req,res)=>{
    if(!models.validateDateTime(req.body.startDateTime)){
        res.status(400).send({code:400,message:"Invalid date-time format of startDateTime or lesser than current date-time"})
    }else if(!models.validateDateTime(req.body.endDateTime)){
        res.status(400).send({code:400,message:"Invalid date-time format of endDateTime or lesser than current date-time"})
    }else if(models.getTimestamp(req.body.startDateTime)>=models.getTimestamp(req.body.endDateTime)){
        res.status(400).send({code:400,message:"End date is lesser than start date"})
    }else{
        models.postTimeSlot(req.body)
        .then(resp=>{
            res.send('success')
        }).catch(err=>{
            res.send(err)
        })
    }
}

module.exports = {
    postTimeSlot : postTimeSlot,
    getTimeSlots : getTimeSlots
}