var dbconn = require('./dbconn')
var moment = require('moment')
var _ = require('underscore')

let postTimeSlot = (body)=>{
    let connection=''
    return dbconn.open()
    .then(conn=>{
        connection = conn
        return conn.db('admin').collection('time_slots')
    }).then(timeslot=>{
        let object = createTimeSlotSchema(body)
        return timeslot.insert(object)
    }).then((result)=>{
        dbconn.close(connection);
        return 'success'
    })
    .catch((err)=>{
        //console.error(err)
        throw err;
    })

}

let getTimeSlots = ()=>{
    let connection=''
    return dbconn.open()
    .then(conn=>{
        connection = conn
        return conn.db('admin').collection('time_slots')
    }).then(timeslot=>{
        return timeslot.find({}).toArray();
    }).then((result)=>{
        let record = getModifiedResult(result)
        dbconn.close(connection);
        return record
    }).catch((err)=>{
        console.error(err)
        throw err;
    })
}

let createTimeSlotSchema = (body)=>{
    let timeSlot = {
        startDateTime:getTimestamp(body.startDateTime),
        endDateTime:getTimestamp(body.endDateTime),
        createTimeStamp:moment().unix(),
        lastUpdatedTimeStamp:moment().unix()
    }
    return timeSlot
}

let getCurrentTimeStamp =()=>{
    return moment().unix()
}

let getTimestamp=(date)=>{
    return moment(date).unix();
}

let validateDateTime =(dateTime)=>{
    if(dateTime&&moment(dateTime).isValid()){
       if(getTimestamp(dateTime)>getCurrentTimeStamp()){
           return true
       }
    }
    return false
}


let getModifiedResult = (result)=>{
    //result = dummyArray
    let sortedRes = _.sortBy(result, 'startDateTime');
    let mergedRes=[]
    for (let i = 0; i < sortedRes.length; i++) {
        if(mergedRes.length>0){
            for (let j = 0; j < mergedRes.length; j++) {
                if(mergedRes[j].endDateTime>=sortedRes[i].startDateTime){
                    if(mergedRes[j].endDateTime<sortedRes[i].endDateTime){
                        mergedRes[j].endDateTime = sortedRes[i].endDateTime
                    }
                }else{
                    if((mergedRes[mergedRes.length-1].endDateTime!=sortedRes[i].startDateTime)&&(mergedRes[mergedRes.length-1].startDateTime!=sortedRes[i].startDateTime)){
                        mergedRes.push(result[i])
                    }
                }
            }
        }else{
            mergedRes.push(result[i])
        }
    }
    
    return convertToLocalDateTime(mergedRes);
}

let convertToLocalDateTime = (list)=>{
    _.map(list, function(obj){
        obj.startDateTime = moment(obj.startDateTime).toLocaleString();
        obj.endDateTime = moment(obj.endDateTime).toLocaleString();
        obj.createTimeStamp = moment(obj.createTimeStamp).toLocaleString();
        obj.lastUpdatedTimeStamp = moment(obj.lastUpdatedTimeStamp).toLocaleString();
      });
    return list
}


let models = {
    postTimeSlot:postTimeSlot,
    getTimestamp:getTimestamp,
    validateDateTime:validateDateTime,
    getTimeSlots:getTimeSlots
}

let dummyArray= [{
    startDateTime : 1583373600,
    endDateTime :1583383600
},{
    startDateTime : 1583383600,
    endDateTime :1583393600
},{
    startDateTime : 1583393600,
    endDateTime :1583423600
},{
    startDateTime : 1583443600,
    endDateTime :1583483600
},{
    startDateTime : 1583583600,
    endDateTime :1583623600
},{
    startDateTime : 1583623600,
    endDateTime :1583663600
}]

module.exports = models

