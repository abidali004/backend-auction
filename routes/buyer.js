const express = require('express');
const router = express.Router();
const { getHighestBid, postBidPrice, perchaseProduct, getmyPerchasedProducts, getmySelledProducts, notifySellerToExtendTime } = require('../controllers/buyerController.js')
const verifyToken = require('../middleware/verifyToken.js');
const upload = require('../middleware/upload.js');


router.get('/highest-bid/:productId', getHighestBid);
router.patch('/perchased-product/:buyerId/:productId', perchaseProduct);
router.post('/highest-bid/:token/:bidPrice/:productId', verifyToken, postBidPrice);
router.get('/get-myProducts/:userId', getmyPerchasedProducts);
router.get('/get-mySelledProducts/:userId', getmySelledProducts);
router.post('/notify-seller/:productId', notifySellerToExtendTime);






module.exports = router;
