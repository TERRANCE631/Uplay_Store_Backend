import jsonServer from "json-server";
import multer from "multer";
import auth from "json-server-auth";
import express from "express";

const server = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// CORS Headers
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// File Upload Middleware (Multer)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        let date = new Date();
        let imageFileName = date.getTime() + "_" + file.originalname;
        req.body.imageFileName = imageFileName;
        cb(null, imageFileName);
    }
});
const bodyParser = multer({ storage: storage }).any();
server.use(bodyParser);

// POST Route - Add Product
server.post("/products", (req, res, next) => {

    req.body.id = Math.floor(Math.random() * 1000000000); // Unique ID

    // Ensure correct data types
    req.body.price = parseFloat(req.body.price) || 0;
    req.body.sale = req.body.sale === "true" || req.body.sale === true;
    req.body.sale_perc = parseFloat(req.body.sale_perc) || 0;
    req.body.rating = parseFloat(req.body.rating) || 0;
    req.body.stock = parseInt(req.body.stock) || 0;

    // Image URL
    if (req.body.imageFileName) {
        req.body.imageFileName = `${req.protocol}://${req.get("host")}/uploads/${req.body.imageFileName}`;
    }

    next();
});

// POST Route - New user
server.post("/Register", (req, res, next) => {
    req.body.id = Math.floor(Math.random() * 1000000000); // Unique ID

    // Image URL
    if (req.body.imageFileName) {
        req.body.imageFileName = `${req.protocol}://${req.get("host")}/uploads/${req.body.imageFileName}`;
    }

    next();
});

// PATCH Route - Update Product
server.patch("/products/:id", (req, res, next) => {

    // Ensure correct data types
    req.body.price = parseFloat(req.body.price) || 0;
    req.body.sale = req.body.sale === "true" || req.body.sale === true;
    req.body.sale_perc = parseFloat(req.body.sale_perc) || 0;
    req.body.rating = parseFloat(req.body.rating) || 0;
    req.body.stock = parseInt(req.body.stock) || 0;

    // Image URL
    if (req.body.imageFileName) {
        req.body.imageFileName = `${req.protocol}://${req.get("host")}/uploads/${req.body.imageFileName}`;
    }

    next();
});

// Middleware & Router Setup
server.use(middlewares);
server.use(auth);
server.use('/api', router);
server.db = router.db;
server.use(router);

// Start Server
server.listen(9000, () => {
    console.log('JSON Server with auth is running on http://localhost:9000');
});
