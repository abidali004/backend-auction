const express = require('express')
const app = express()
const connectDB = require('./config/db')
const userRouter = require('./routes/user')
const buyerRouter = require('./routes/buyer')
const path = require('path');
const multer = require('multer')
const cors = require('cors')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const http = require('http')
const server = http.createServer(app)
dotenv.config()
const Message = require('./models/messageModel')



// database connection function
connectDB();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/uploads', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public'));
const upload = multer();
// user midleware
app.use('/user', userRouter)
app.use('/buyer', buyerRouter)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});
const users = {};

io.on('connection', (socket) => {
    console.log("user connected")

    // socket.on('joinChat', async ({ userId, productId }) => {

    //     console.log("product id  in chat", productId)
    //     if (userId && productId) {
    //         users[userId] = socket.id;

    //         const messages = await Message.find({ productId: productId, $or: [{ recipientId: userId }, { sender: userId }] })
    //         if (messages.length !== 0) {
    //             messages.forEach(async (msg) => {
    //                 console.log("every msg", msg.content)
    //                 socket.emit('message', { fromUserId: msg.sender, message: msg.content, productId: msg.productId })
    //                 msg.isRead = true;
    //                 await msg.save();

    //             })
    //         }
    //     }
    // });
    socket.on('joinChat', async ({ userId, productId }) => {
        console.log("product id in chat", productId, userId)
        if (userId && productId) {
            users[userId] = socket.id;

            const messages = await Message.find({
                productId: productId,
                $or: [{ recipientId: userId }, { sender: userId }]
            });

            if (messages.length !== 0) {
                messages.forEach(async (msg) => {
                    const isFromSelf = msg.sender && msg.sender.toString() === userId;

                    socket.emit('message', {
                        fromUserId: msg.sender,
                        message: msg.content,
                        productId: msg.productId,
                        isFromSelf
                    });

                    if (!isFromSelf) {
                        msg.isRead = true;
                        await msg.save();
                    }
                });
            }
        }
    });


    socket.on('new message', async ({ message, fromUserId, toUserId, productId }) => {
        console.log("send smsm idprod", productId)
        const recipientSocketId = users[toUserId];
        if (recipientSocketId) {
            console.log("user id ", message)
            console.log("froUserId ", fromUserId)
            console.log("to user id ", toUserId)

            socket.to(recipientSocketId).emit('message', { fromUserId, message, productId });

        }

        const res = await Message.create({
            sender: fromUserId,
            recipientId: toUserId,
            content: message,
            isRead: recipientSocketId ? true : false,
            productId: productId,
        });
        console.log("mes res", res)
    })
})


server.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`.yellow.bold))