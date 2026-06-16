const { validationResult } = require("express-validator");
const db = require("../db/queries")

exports.mainCategoryGet = async (req, res) => {
    const mainCategories = (await db.mainCategory());
    res.render('categories', {parentId: null, categories: mainCategories, productList: null})
}

exports.categoryDetailGet = async (req, res) => {
    const idCat = parseInt(req.params.categoryId);
    const subCatList = await db.subCategory(idCat);
    const productList = await db.catProductList(idCat);
    res.render('categories', {parentId: idCat, categories: subCatList, productList: productList})
}

exports.createCategoryGet = async (req, res) => {
    const categoryId = req.query.categoryId || null;
    res.render("categoryAdd", {parentId: categoryId});
}

exports.createCategoryPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const categoryId = req.query.categoryId || null;
        return res.status(400).render("categoryAdd", {
            parentId: categoryId,
            errors: errors.array()
        });
    }

    const parentId = req.query.categoryId || null;
    const {catName, catDescription} = req.body;
    await db.addCategory(catName, catDescription, parentId)
    res.redirect(`/categories/${req.query.categoryId}`)
}

exports.editCategoryGet = async (req, res) => {
    const catId = req.params.categoryId;
    const info = req.query;
    const catInfo = await db.catInfo(catId);
    const catList = await db.catList();
    res.render('categoryEdit', {category: catInfo, parentId: info.parentId, catList: catList})
}

exports.editCategoryPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const catId = req.params.categoryId;
        const info = req.query;
        const catInfo = await db.catInfo(catId);
        const catList = await db.catList();
        return res.status(400).render('categoryEdit', {
            category: catInfo, 
            parentId: info.parentId, 
            catList: catList,
            errors: errors.array()
        })
    }

    const categoryId = req.params.categoryId;
    const changes = req.body;   
    if(changes.subCatOf === '') {
        changes.subCatOf = null;
    }
    await db.updateCategory(categoryId, changes.catName, changes.catDescription, changes.subCatOf)
    res.redirect(`/categories/${req.query.parentId}`)
}

exports.categoryDeleteGet = async (req, res) => {
    const catId = req.params.categoryId;
    const parentId = req.query.parentId;
    const catInfo = await db.catInfo(catId);
    res.render('categoryDelete', {category: catInfo, parentId: parentId});
}

exports.categoryDeletePost = async (req, res) => {
    const catId = req.params.categoryId;
    await db.deleteCategory(catId);
    res.redirect(`/categories/${req.query.parentId}`)
}

exports.categoryAddProductGet = async (req, res) => {
    const categoryId = req.params.categoryId;

    const links = {
        nav: 'navigation',
        href: `/categories/${categoryId}/add`,
        cancel: `/categories/${categoryId}`
    }
    res.render("productAdd", {links: links, categoryId: categoryId, catList: null})
}

exports.categoryAddProductPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const categoryId = req.params.categoryId;

        const links = {
            nav: 'navigation',
            href: `/categories/${categoryId}/add`,
            cancel: `/categories/${categoryId}`
        }
        return res.status(400).render("productAdd", {
            links: links, 
            categoryId: categoryId, 
            catList: null,
            errors: errors.array()
        })
    }

    const catId = req.params.categoryId;
    const prdName = req.body.prdName;
    const quantity = parseInt(req.body.quantity);
    const unitPrice = parseFloat(req.body.unit_price);
    await db.addProductToCategory(catId, prdName, quantity, unitPrice);

    res.redirect(`/categories/${catId}`);
}

exports.editProductGet = async (req, res) => {
    const {categoryId, productId} = req.params;

    const links = {
        nav: 'navigation',
        href: `/categories/${categoryId}/${productId}/edit`,
        cancel: `/categories/${categoryId}`
    }

    const product = await db.getProduct(productId);
    const catList = await db.catList();
    res.render('productEdit', {links: links,product: product, categoryId: categoryId, catList: catList});
}

exports.editProductPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const {categoryId, productId} = req.params;

        const links = {
            nav: 'navigation',
            href: `/categories/${categoryId}/${productId}/edit`,
            cancel: `/categories/${categoryId}`
        }

        const product = await db.getProduct(productId);
        const catList = await db.catList();
        return res.status(400).render('productEdit', {
            links: links,
            product: product, 
            categoryId: categoryId, 
            catList: catList,
            errors: errors.array()
        });
    }

    const params = req.params;
    const changes = req.body;
    changes.quantity = parseInt(changes.quantity)
    changes.unit_price = parseFloat(changes.unit_price)
    await db.updateProduct(params.productId, changes.prdName, changes.quantity, changes.unit_price, changes.categoryName )
    res.redirect(`/categories/${params.categoryId}`)
}

exports.deleteProductGet = async (req, res) => {    
    const params = req.params;

    const link = {
        nav : "navigation",
        href : `/categories/${params.categoryId}/${params.productId}/delete`,
        cancel : `/categories/${params.categoryId}`
    }

    const product = await db.getProduct(params.productId);
    res.render('productDelete', {links: link, product: product, categoryId: params.categoryId})
}

exports.deleteProductPost = async (req, res) => {
    const params = req.params;
    await db.deleteProduct(params.productId);
    res.redirect(`/categories/${params.categoryId}`)
}