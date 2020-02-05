const  mongoClient = require('mongodb').MongoClient;



function open(){
    let url = "mongodb://localhost:27017";
    return mongoClient.connect(url)
}

function close(db){
    //Close connection
    if(db){
        db.close();
    }
}

let dbconn = {
    open : open,
    close: close
}

module.exports = dbconn;