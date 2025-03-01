import jsonServer from "json-server";
import multer from "multer";
const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
import auth from "json-server-auth";

const server = jsonServer.create();

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
        let date = new Date();
        let imageFileName = date.getTime() + "_" + file.originalname
        req.body.imageFileName = imageFileName
        cb(null, imageFileName)
    }
})

const bodyParser = multer({ storage: storage }).any()
server.use(bodyParser);

server.post("/products", (req, res, next) => {
    if (req.body.price) {
        const price = Number(req.body.price);
        if (!isNaN(price)) {
            req.body.price = price;
        } else {
            return res.status(400).json({ error: "Invalid price format" });
        }
    }

    const id = Math.floor(Math.random() * 1000000000);
    req.body.id = id;

    req.body.sale = Boolean(req.body.sale);
    if(req.body.sale){
        req.body.sale === true
    }else{  
        req.body.sale === false
    }

    if (req.body.sale_perc) {
        const price = Number(req.body.sale_perc);
        if (!isNaN(price)) {
            req.body.sale_perc = price;
        } else {
            return res.status(400).json({ error: "Invalid sale percent format" });
        }
    }
    next();
});

server.use('/api', router);
server.db = router.db

server.use(auth)
server.use(middlewares)
server.use(router)

// Start the server on port 9000
server.listen(9000, () => {
    console.log('JSON Server with auth is running on http://localhost:9000');
});
