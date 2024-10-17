const express = require('express');
const router = express.Router();
const { SignupForm, loginForm, forgetPassword, reset_forgetPassword } = require('../controllers/authController');
const { sellProduct, getAllProducts, getSellectedProduct, getFiletrProducts } = require('../controllers/sellerController');
const { clearChat } = require('../controllers/userController');

const verifyToken = require('../middleware/verifyToken.js');
const upload = require('../middleware/upload.js');

router.post('/signup', SignupForm);
router.post('/login', loginForm);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', verifyToken, reset_forgetPassword);
router.post('/sell-product/:token', upload.array('photo', 10), verifyToken, sellProduct);
router.get('/all-products', getAllProducts);
router.get('/selected-product/:id', getSellectedProduct);
router.patch('/clear-chat/:userId/:productId', clearChat);
router.get('/filter-Products/:category', getFiletrProducts);






module.exports = router;
