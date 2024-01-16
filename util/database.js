const mongodb= require('mongodb');
const MongoClient = mongodb.MongoClient;   //we use client to connect to database

var _db;

const mongoConnect = callback => {

  MongoClient.connect('mongodb+srv://prakash:prakash9031@cluster0.c9lcyai.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client=> {
    console.log('connected mongoDB')
    _db=client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw 'No DataBase Found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



