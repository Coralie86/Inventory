const {Router} = require("express")
const validateProduct = require("../controllers/validations/validationsProduct")
const productController = require("../controllers/productController")

const productRouter = Router();

productRouter.get('/', productController.allProductsGet)

productRouter.get('/new', productController.addProductGet)
productRouter.post('/new', validateProduct, productController.addProductPost)

productRouter.get('/:productId/edit', productController.editProductGet)
productRouter.post('/:productId/edit', validateProduct, productController.editProductPost)

productRouter.get('/:productId/delete', productController.deleteProductGet)
productRouter.post('/:productId/delete', productController.deleteProductPost)

module.exports = productRouter;

