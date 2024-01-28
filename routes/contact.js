
const express=require('express');
const router=express.Router();

const contactController = require('../controllers/contact');

router.get('/contactus',contactController.getContact);
router.post('/success' , contactController.successmsg);

module.exports = router;