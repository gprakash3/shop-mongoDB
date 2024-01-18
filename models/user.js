const getDb= require('../util/database').getDb;
const mongodb= require('mongodb');

class User{
  constructor(name, email,cart,id){
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  insertUser(){
    let db=getDb();
    return db.collection('users').insertOne(this)
    .then(result => console.log(result))
    .catch(err => console.log(err));
  }

  addTocart(product){
    console.log(this);
    //by me
    //if item exist in cart then check product in cart
    if(this.cart!=undefined){
      var cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      });
    }
    //if item does not exist in cart then insert product detail in items and then insert item to cart
    //otherwise there will not be any item in cart and above logic will throw error as this.cart.item will be undefined
    else{
      const updatedcartItems=[{productId:new mongodb.ObjectId(product._id),quantity:1}];
      const updatedCart = {
        items: updatedcartItems
      };
      const db= getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{cart: updatedCart}})
    }
    //if item exist in cart then
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    //if product found in cart, then increase quantity by one.
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    //if product not found in cart then add product to cart and add quantity as 1.
    else{
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
        const db= getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{cart: updatedCart}})
  }

  static findById(userId){
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
