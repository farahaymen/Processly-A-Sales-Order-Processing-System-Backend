const { Router } = require('express');

const productsController = require('../controllers/products');

const productsRouter = Router();

productsRouter.get('/', productsController.getProducts);

productsRouter.post('/', productsController.postProduct);


productsRouter.get('/:productId', productsController.getProduct);

//productsRouter.delete('/:productId', productsController.deleteProduct);
productsRouter.delete('/', productsController.deleteProduct);

//productsRouter.delete('/', productsController.deleteProductByName);

productsRouter.put("/", productsController.editProduct)

module.exports = productsRouter;
