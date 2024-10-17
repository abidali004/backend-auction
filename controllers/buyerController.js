const Bids = require('../models/bidsModel')
const Products = require('../models/sellerModel')
const User = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();



const getHighestBid = async (req, res) => {
    const { productId } = req.params;
    console.log("id hig bid ", productId)
    try {
        const highestBid = await Bids.find({ product: productId }).sort({ offerBidPrice: -1 }).limit(1).exec()

        if (!highestBid || highestBid.length === 0) {
            return res.status(200).json({ message: "server error let", highestBid: null })
        }
        console.log("hi bid", highestBid)

        return res.status(200).json({ message: "highest find successfully", highestBid: highestBid[0] })

    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "server error" })
    }
}

const postBidPrice = async (req, res) => {
    const { bidPrice, productId } = req.params;
    const buyer = req.user;
    if (!buyer) return res.status(404).json({ message: "pease login your bid" })
    try {
        const highestBid = await Bids.create({
            offerBidPrice: bidPrice,
            buyer: buyer._id,
            product: productId,

        })
        if (!highestBid) {
            return res.status(404).json({ message: "server error " })
        }

        return res.status(200).json({ message: "your bid created  successfully", highestBid })

    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: "server error" })
    }
}

const perchaseProduct = async (req, res) => {
    const { buyerId, productId } = req.params;
    console.log(" perchase product id", productId, buyerId)
    try {
        const perchaseProduct = await Products.findByIdAndUpdate(productId, { buyer: buyerId }, { isSold: true }, { new: true })
        console.log("perchased product", perchaseProduct)
        if (!perchaseProduct) {
            return res.status(404).json({ message: "server error" })
        }

        return res.status(200).json({ message: "highest find successfully", perchaseProduct })

    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: "server error" })
    }
}

const getmyPerchasedProducts = async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    if (!userId) return res.status(404).json({ message: "please login " })

    const myProducts = await Products.find({ buyer: userId })
    if (!myProducts) {
        return res.status(400).json({ message: "you dont perchased any product" })
    }
    console.log(myProducts)
    return res.status(200).json({ message: "product get successfully", myProducts })
}

const getmySelledProducts = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(404).json({ message: "please login " })

    const myProducts = await Products.find({ seller: userId })
    if (!myProducts) {
        return res.status(400).json({ message: "you dont perchased any product" })
    }
    return res.status(200).json({ message: "product get successfully", myProducts })
}

const notifySellerToExtendTime = async (req, res) => {
    const { productId } = req.params;
    console.log("email")
    if (!productId) return res.status(400).json({ message: "user id and productId  required" });
    console.log("hello")

    const product = await Products.findById(productId);
    const user = await User.findById(product.seller);

    if (!user)
        return res.status(400).json({ message: "this user doesnt exist" });
    if (!product)
        return res.status(400).json({ message: "this product doesnt exist" });


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: "1d" });
    if (!token) {
        return res.status(500).json({ message: "Server error" });
    }

    res.cookie("token", token);


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user?.email,
        subject: "Action Required: Extend Auction Time for Your Product",
        text: `
            Dear ${user.name},
    
            We noticed that your product "${product?.title}" hasn't received any bids yet. To increase your chances of selling, we recommend extending the auction time.
    
            Please log in to your seller account and extend the bidding period to attract more buyers.
    
            Thank you for using our platform!
    
            Best regards,
            [My Auction.com] Team
        `,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("error send email", error)
            return res.status(500).json({ message: "Failed to send email", error });
        }
        console.log("email send ")
        return res.status(200).json({ message: `Email sent to ${user.email}` });
    });
};


module.exports = {
    getHighestBid,
    postBidPrice,
    perchaseProduct,
    getmyPerchasedProducts,
    getmySelledProducts,
    notifySellerToExtendTime,
}