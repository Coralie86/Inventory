const {Router} = require("express")
const categoryController = require("../controllers/categoryController")
const validateProduct = require("../controllers/validations/validationsProduct")
const validateCategory = require("../controllers/validations/validationsCategory")

const categoryRouter = Router();

categoryRouter.get('/', categoryController.mainCategoryGet)
categoryRouter.get('/new', categoryController.createCategoryGet)
categoryRouter.post('/new', validateCategory, categoryController.createCategoryPost)

categoryRouter.get('/:categoryId', categoryController.categoryDetailGet)

categoryRouter.get('/:categoryId/edit', categoryController.editCategoryGet)
categoryRouter.post('/:categoryId/edit', validateCategory, categoryController.editCategoryPost)

categoryRouter.get('/:categoryId/delete', categoryController.categoryDeleteGet)
categoryRouter.post('/:categoryId/delete', categoryController.categoryDeletePost)

categoryRouter.get('/:categoryId/add', categoryController.categoryAddProductGet)
categoryRouter.post('/:categoryId/add', validateProduct, categoryController.categoryAddProductPost)

categoryRouter.get('/:categoryId/:productId/edit', categoryController.editProductGet)
categoryRouter.post('/:categoryId/:productId/edit',validateProduct, categoryController.editProductPost)

categoryRouter.get('/:categoryId/:productId/delete', categoryController.deleteProductGet)
categoryRouter.post('/:categoryId/:productId/delete', categoryController.deleteProductPost)

module.exports = categoryRouter;