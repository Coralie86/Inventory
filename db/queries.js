const pool = require("./pool");

async function homeNbGet() {
    const {rows} = await pool.query("SELECT \
                                (SELECT COUNT(DISTINCT name) FROM categories) AS nb_cat,\
                                (SELECT COUNT(DISTINCT name) FROM products) AS nb_prod,\
                                (SELECT COALESCE(SUM(quantity), 0) FROM products) AS nb_stock,\
                                (SELECT COALESCE(SUM(unit_price * quantity), 0) FROM products) AS stock_value")
    return rows[0]
}

async function mainCategory() {

    const {rows} = await pool.query("SELECT a.id, a.name, a.description, SUM(a.nb_items + COALESCE(b.nb_items, 0)) as nb_items, SUM(a.total_qt + COALESCE(b.total_qt, 0)) as total_qt FROM\
        (SELECT DISTINCT cat.id, cat.name, description, COUNT(DISTINCT products.name) AS nb_items, COALESCE(SUM(products.quantity), 0) AS total_qt FROM categories cat \
        LEFT JOIN products on products.category_name = cat.name WHERE cat.sub_category_of is null\
        GROUP BY cat.id, cat.name, description) a \
        LEFT JOIN (SELECT cat.sub_category_of as category, COUNT(DISTINCT pro.name) as nb_items, COALESCE(SUM(pro.quantity),0) as total_qt FROM categories cat\
        JOIN products pro on pro.category_name = cat.name WHERE cat.sub_category_of is not null GROUP BY cat.sub_category_of)b on b.category = a.name \
        GROUP BY a.id, a.name, a.description \
        ")
    
    // console.log(rows)
    return rows
}

async function subCategory(id) {
    const subCategories = await pool.query(" SELECT a.parent_name, a.id, a.name, a.description, COUNT(DISTINCT pro.name) AS nb_items, COALESCE(SUM(pro.quantity), 0) AS total_qt \
        FROM (SELECT cat.name as parent_name, sub.id, sub.name, sub.description FROM categories sub \
            JOIN (SELECT name FROM categories WHERE id = ($1))cat on cat.name = sub.sub_category_of)a\
        LEFT JOIN products pro on pro.category_name = a.name \
        GROUP BY a.parent_name, a.id, a.name, a.description", [id])
    
    return subCategories.rows   
}

async function catProductList(id) {
    const categoryName = await pool.query("SELECT name as parent_name FROM categories WHERE id = ($1) ", [id]);
    const catProducts = await pool.query(" SELECT pro.id, pro.name, pro.quantity, pro.unit_price FROM products pro\
        JOIN (SELECT name FROM categories WHERE id = ($1) )cat on cat.name = pro.category_name ", [id])
    
    return [categoryName.rows[0] , catProducts.rows]
}

async function addCategory(category, description, parent_id) {
    let sub_category_of = null;
    if(parent_id !== null) {
        sub_category_of = (await pool.query(" Select name from categories where id = ($1) ", [parent_id])).rows[0].name;
    }
    await pool.query(" INSERT INTO categories (name, description, sub_category_of) VALUES ($1, $2, $3) ", [category, description, sub_category_of])
}

async function catInfo(categoryId) {
    const {rows} = await pool.query("SELECT * FROM categories where id = ($1) ", [categoryId]);
    return rows[0]
}

async function catList() {
    const {rows} = await pool.query("SELECT distinct name FROM categories ");
    return rows
}

async function updateCategory(id, name, desc, subCatOf){
    await pool.query("UPDATE categories SET name = ($1), description = ($2), sub_category_of = ($3) WHERE id = ($4)", [name, desc, subCatOf, id])
}

async function uncategorizeProduct(id) {
    await pool.query("UPDATE products SET category_name = 'Uncategorized Products' WHERE category_name = (SELECT name FROM categories WHERE id = ($1))", [id])
}

async function deleteCategory(id) {
    await uncategorizeProduct(id);
    await pool.query("DELETE FROM categories where id = ($1) ", [id]);
}

async function addProductToCategory(id, name, qt, price) {
    const nameCat = (await pool.query("SELECT name FROM categories where id = ($1)", [id])).rows[0];
    await pool.query("INSERT INTO products (name, category_name, quantity, unit_price) VALUES ($1, $2, $3, $4) ", [name, nameCat.name, qt, price])  
}

async function getProduct(id) {
    const {rows} = await pool.query("Select * FROM products where id = ($1) ", [id])
    return rows[0]
}

async function updateProduct(prdId, prdName, quantity, unit_price, categoryName){
    await pool.query("UPDATE products SET name = ($1), quantity = ($2), unit_price = ($3), category_name = ($4) WHERE id = ($5) ",
         [prdName, quantity, unit_price, categoryName, prdId])
}

async function deleteProduct(id) {
    await pool.query("DELETE FROM products where id  =($1) ", [id]);
}

async function getAllProducts() {
    const {rows} = await pool.query("SELECT * FROM products order by category_name, name");
    return rows
}

async function addProduct(catName, prdName, qt, price) {
    await pool.query("INSERT INTO products (name, category_name, quantity, unit_price) VALUES ($1, $2, $3, $4) ", [prdName, catName, qt, price])  
}

module.exports = {
    homeNbGet, mainCategory, subCategory, catProductList,addCategory, catInfo, catList, updateCategory, 
    deleteCategory, addProductToCategory, getProduct,updateProduct, deleteProduct, getAllProducts,
    addProduct
}