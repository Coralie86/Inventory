require("dotenv").config();
const express = require("express")
const path = require("node:path")
const app = express();
const categoryRouter = require("./routes/categoryRouter")
const productRouter = require("./routes/productRouter")
const homeRouter = require("./routes/homeRouter")

// Set up views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up assets
const assetspath = path.join(__dirname, "public");
app.use(express.static(assetspath));

// Set up encoding
app.use(express.urlencoded({extended: true}));

// Set up PORT
const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Connected to Inventory app. Listening on port ${PORT}`)
})

app.use("/", homeRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);