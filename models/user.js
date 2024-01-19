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
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
        const db= getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{cart: updatedCart}})
  }

  //get all product available in cart
  getCart(){
    const db=getDb();
    //since this.cart.item will contain product id and quantity and we only want product id as array to pass it in find(), we use map here.
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    //it will return product contain in array productIds (which is products embedded in user collection)
    return db.collection('products').find({_id:{$in: productIds}}).toArray()
    .then(products => {
      //to get quantity of returned products in user collection
      return products.map(prod => {
        //returning all property of product along with quantity
        //we use arrow function so that this will have access to cart items.
        //again, cartitem will contain product and quantity,  we only add quantity.
        return {...prod, quantity: this.cart.items.find(cartitem => {
            //here cartitem.productId and prod._id is of type mongodb ObjectId hence we convert it to string for comparision
          return cartitem.productId.toString() == prod._id.toString();
        }).quantity}
      })
    })
  }


  //delete cart items
  deleteById(prodId){
    const updatedcart = this.cart.items.filter(item => {
      return item.productId.toString()!=prodId.toString();
    });
    const db= getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{cart: {items:updatedcart}}});

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
