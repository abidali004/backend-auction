const Products = require('../models/sellerModel')
const path = require('path')


const sellProduct = async (req, res) => {
    const { title, startTime, endTime, condition, startPrice, description, location, category } = req.body;
    if (!title || !startTime || !endTime || !condition || !startPrice || !description || !location || !req.files || !category) return res.status(500).json({ message: "some fields required" })
    const files = req.files;
    const productImages = files.map(file => path.basename(file.path));
    const currentUser = req.user;

    try {
        const user = await Products.create({
            title,
            category,
            startTime,
            endTime,
            condition,
            startPrice,
            description,
            location,
            images: productImages,
            seller: currentUser._id,
        })
        if (!user) {
            return res.status(404).json({ message: "some ishue in backend" })
        }
        return res.status(201).json({ message: "data created successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).jason({ messsage: "server error" })
    }

};

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Products.find({
            buyer: null,
            isSold: false,
            endTime: { $gt: new Date() }
        });

        if (!allProducts) {
            return res.status(500).json({ message: "server error" })
        }

        return res.status(200).json({ message: "get all products successfully", allProducts })

    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}
// const getSellectedProduct = async (req, res) => {

//     const productId = req.params.id

//     if (!productId) return res.status(404).json({ message: "server error" })
//     try {
//         const selectedProduct = await Products.findById(productId)
//         console.log("selllected product", selectedProduct)
//         if (!selectedProduct) {
//             return res.status(500).json({ message: "this product dont exist", selectedProduct })
//         }

//         return res.status(200).json({ message: "product find successfully", selectedProduct })

//     } catch (error) {
//         console.log(error)
//         return res.status(404).json({ message: "server error" })
//     }
// }
const getSellectedProduct = async (req, res) => {
    const productId = req.params.id;

    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    try {
        const selectedProduct = await Products.findById({ _id: productId, endTime: { $gt: new Date() } });
        console.log("Selected product:", selectedProduct);

        if (!selectedProduct) {
            return res.status(404).json({ message: "This product doesn't exist", data: null });
        }

        return res.status(200).json({ message: "Product found successfully", selectedProduct });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getFiletrProducts = async (req, res) => {
    const category = req.params;
    console.log("title in node", category)
    if (!category) return res.status(400).json({ message: "title  is required" });

    try {
        const filetrProducts = await Products.find(category);
        console.log("filetr product:", filetrProducts);

        if (!filetrProducts) {
            return res.status(404).json({ message: "This product doesn't exist", data: null });
        }

        return res.status(200).json({ message: "Product found successfully", filetrProducts });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



module.exports = {
    sellProduct,
    getAllProducts,
    getSellectedProduct,
    getFiletrProducts,
}