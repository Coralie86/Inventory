require("dotenv").config();
const {Client} = require("pg");

const SQL = `
DROP TABLE categories;
DROP TABLE products;

CREATE TABLE IF NOT EXISTS  categories (
    id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255) NOT NULL,
    description VARCHAR(255),
    sub_category_of VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS  products (
    id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    category_name VARCHAR (255) NOT NULL,
    quantity INTEGER,
    unit_price DECIMAL(5,2)
);

INSERT INTO categories (name, description, sub_category_of)
VALUES
    ('Fresh Products', 'Vegetables, fruits, meat, fish' ,NULL),
    ('Vegetables', 'Products from the earth like salad, beetroot, etc' , 'Fresh Products'),
    ('Fruits', 'A sweet taste with bananas, oranges, pears, etc' , 'Fresh Products'),
    ('Seefood', 'What the sea is offering to us', 'Fresh Products'),
    ('Meat', 'From the closest butcher', 'Fresh Products'),
    ('Dairy Goods', 'yogurt, milk, butter', NULL),
    ('Dry Goods', 'Flour, sugar, cacao', NULL),
    ('Uncategorized Products', 'Products Pending to be categorized', NULL);

INSERT INTO products (name, category_name, quantity, unit_price)
VALUES
    ('salad', 'Vegetables', 2, 0.95),
    ('raddish', 'Vegetables', 3,1.05),
    ('tomato', 'Vegetables', 5, 0.95),
    ('zucchini', 'Vegetables', 5, 0.65),
    ('carottes', 'Vegetables', 7, 1.30),
    ('oranges', 'Fruits',8, 2.65),
    ('strawberries', 'Fruits', 10, 2.55),
    ('mango', 'Fruits', 6, 1.95),
    ('pears', 'Fruits', 4, 1.40),
    ('vanilla yogurt', 'Dairy Goods', 12, 1.25),
    ('milk', 'Dairy Goods', 10, 1.10),
    ('goat cheese', 'Dairy Goods', 4, 1.14),
    ('cream', 'Dairy Goods', 3, 1.14);

`

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}
console.log(process.env.DATABASE_URL)
main();
