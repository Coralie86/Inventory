const {body} = require("express-validator")

const alphaErr = "must only contain letters";
const lengthNameErr = "must contain between 1 and 15 characters"
const qtErr = "must be an integer"
const priceErr = "must be between 0 and 999.99 € (dot as decimal separator)"

const validateProduct = [
    body("prdName").trim()
    .isAlpha().withMessage(`Product Name ${alphaErr}`)
    .isLength({min: 1, max: 15}).withMessage(`Product Name ${lengthNameErr}`),
    body("quantity").trim()
    .isInt({min: 0}).withMessage(`Quantity ${qtErr}`),
    body("unit_price").trim()
    .isDecimal({decimal_digits: '1,2', force_decimal: true}).withMessage(`Unit Price ${priceErr}`)
]

module.exports = validateProduct;