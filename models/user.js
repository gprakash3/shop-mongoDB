const getDb= require('../util/database').getDb;
const mongodb= require('mongodb');

class User{
  constructor(name, email){
    this.name = name;
    this.email = email;
  }

  insertUser(){
    let db=getDb();
    return db.collection('users').insertOne(this)
    .then(result => console.log(result))
    .catch(err => console.log(err));
  }

  static findUserbyID(userId){
    let db=getDb();
    return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next()
    .then(user => {
      // console.log(user);
      return user;
    })
    .catch(err => console.log(err));
  }
}

module.exports = User;
