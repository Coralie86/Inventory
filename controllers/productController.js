const db = require("../db/queries")
const validateProduct = require("./validations/validationsProduct")
const {body, validationResult, matchedDate} = require("express-validator")

exports.allProductsGet = async (req, res) => {
    const listProducts = await db.getAllProducts();
    res.render('productsAllList', {productList: listProducts})
}

exports.addProductGet = async (req, res) => {
    const listCategories = await db.catList();

    const links = {
        nav: 'navigation',
        href: "/products/new",
        cancel: "/products"
    }
    res.render("productAdd", {links: links, catList: listCategories})
}

exports.addProductPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const listCategories = await db.catList();

        const links = {
            nav: 'navigation',
            href: "/products/new",
            cancel: "/products"
        }
        
        return res.status(400).render("productAdd", {
            links: links, 
            catList: listCategories,
            errors: errors.array()
        })
    }

    const info = req.body;
    info.quantity = parseInt(info.quantity);
    info.unit_price = parseFloat(info.unit_price);
    console.log(info)
    await db.addProduct(info.categoryName, info.prdName, info.quantity, info.unit_price);
    res.redirect('/products')
}

exports.editProductGet = async (req, res) => {
    const prdId = req.params.productId;

    const links = {
        nav: 'navigation',
        href: `/products/${prdId}/edit`,
        cancel: `/products`
    }

    const productEdited = await db.getProduct(prdId);
    const listCategories = await db.catList();
    res.render('productEdit', {links: links, product: productEdited, catList: listCategories})
}

exports.editProductPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const prdId = req.params.productId;

        const links = {
            nav: 'navigation',
            href: `/products/${prdId}/edit`,
            cancel: `/products`
        }

        const productEdited = await db.getProduct(prdId);
        const listCategories = await db.catList();
        res.status(400).render('productEdit', {
            links: links, 
            product: productEdited, 
            catList: listCategories, 
            errors: errors.array()})
    }

    const prdId = req.params.productId;
    const changes = req.body;
    changes.quantity = parseInt(changes.quantity);
    changes.unit_price = parseFloat(changes.unit_price);
    await db.updateProduct(prdId, changes.prdName, changes.quantity, changes.unit_price, changes.categoryName);
    res.redirect('/products');
}

exports.deleteProductGet = async (req, res) => {
    
    const prdId = req.params.productId;
    const link = {
        nav : "navigation",
        href : `/products/${prdId}/delete`,
        cancel : "/products"
    }
    const productDelete = await db.getProduct(prdId);
    res.render('productDelete', {product: productDelete, links: link})
}

exports.deleteProductPost = async (req, res) => {
    const prdId = req.params.productId;
    await db.deleteProduct(prdId);
    res.redirect('/products');
}