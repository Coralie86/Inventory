const {body} = require("express-validator")

const alphaErr = "must only contain letters";
const lengthNameErr = "must contain between 1 and 30 characters"
const lengthDescrErr = "must contain between 1 and 30 characters"

const validateCategory = [
    body("catName").trim()
    .isAlpha('en-US', {ignore: ' ,'}).withMessage(`Category Name ${alphaErr}`)
    .isLength({min: 1, max: 30}).withMessage(`Category Name ${lengthNameErr}`),
    body("catDescription").trim()
    .isAlpha('en-US', {ignore: ' ,'}).withMessage(`Category Description ${alphaErr}`)
    .isLength({min: 1, max: 200}).withMessage(`Category Description ${lengthDescrErr}`)
]

module.exports = validateCategory;