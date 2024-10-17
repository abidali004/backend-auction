// const Signup = require("../models/userModel");
// const bcrypt = require("bcrypt");

// const updateProfile = async (req,res) => {

//     const { userName, email, phone, address, password, newPassword } = req.body;
//     const {id} = req.params;
//     const photo = req.file;
//     let user;
//     try {
//         user = await Signup.findOne({_id: id});
//         let hash;
//         if(password && newPassword){

//             const match = await bcrypt.compare(password, user.password);
//             if(!match){
//                 return res.status(400).json({message: 'Incorrect password'})
//             }

//             hash = await bcrypt.hash(newPassword, Number(process.env.SALTROUND));
//         }
//         if(photo){
//             user = await Signup.findOneAndUpdate({_id: id}, { userName, email, phone, address, password: hash, photo: req.file.filename}, {new: true})
//         }else{
//             user = await Signup.findOneAndUpdate({_id: id}, { userName, email, phone, address, password: hash}, {new: true})
//         }
//        if(!user){
//         return res.status(404).json({message: 'User not found'})
//        }

//        return res.status(200).json({message: 'Profile updated', user})

//     } catch (error) {
//         return res.status(500).json({message: 'Internal Server Error'})
//     }
// }

// const getById = async (req,res) =>{

//     const {id} = req.params;
//     let user;
//     try {
//       user = await Signup.findOne({_id: id})
//       if(!user){
//         return res.status(404).json({message: 'User not found'});
//       }
//       return res.status(200).json({user})
//     } catch (error) {
//         return res.status(500).json({message: 'Internal Server Error'})
//     }
// }

// module.exports = {
//     updateProfile,
//     getById
// }

const Products = require("../models/sellerModel");
const Message = require("../models/messageModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();



const clearChat = async (req, res) => {

    const { userId, productId } = req.params;
    console.log("clear chat", productId)
    console.log("clear chat", userId)

    if (!productId || !userId) return res.status(404).json({ message: "try again dont id get" })
    try {
        const clearedSms = await Message.updateMany(
            {
                productId,
                $or: [
                    { recipientId: userId },
                    { sender: userId }
                ]
            },
            [
                {
                    $set: {
                        recipientId: { $cond: [{ $eq: ["$recipientId", userId] }, null, "$recipientId"] },
                        sender: { $cond: [{ $eq: ["$sender", userId] }, null, "$sender"] }
                    }
                }
            ]


        )
        console.log("deleted sms", clearedSms)
        if (!clearedSms) {
            return res.status(500).json({ message: "try again" })
        }
        return res.status(201).json({ message: "messages deleted susccessfully", clearedSms })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "try again" })
    }

}
module.exports = {
    clearChat,
}