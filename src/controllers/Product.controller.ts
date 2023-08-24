import { Express, NextFunction, Request, Response } from "express";
import { IProduct } from "../interfaces/Product.interfaces";
import ProductService from "../services/Product.service";
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../helpers/status_codes";

export default (app: Express, productService: ProductService): void => {
    
    app.get('/products/sorted', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const order = (request.query.order as string)?.toLowerCase() || "desc";
            const field = request.query.field as string || "name";
        
            const sortedProductsList: IProduct[] = await productService.listAllProducts({ order, field });
            response.status(HTTP_OK).json({
                products: sortedProductsList
            });
        } catch(err) {
            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
    
    app.post('/products', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id, name, sellValue } = request.body;
            const registrationResult = await productService.registerNewProduct({ id, name, sellValue });
        
            const statusCode = registrationResult.success ? HTTP_OK : HTTP_BAD_REQUEST;
            response.status(statusCode).json(registrationResult);
        } catch(err) {
            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
    
    app.put('/products', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const updateResult = await productService.updateProduct(request.body);
            response.json(updateResult);
        } catch(err) {
            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
    
    app.get('/products', async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.query.name) {
                const productByName: IProduct | null = await productService.findProductByName(request.query.name as string);
                if (productByName === null) {
                    response.sendStatus(HTTP_NOT_FOUND);
                    return;
                }
                response.status(HTTP_OK).json(productByName);
            } else if (request.query.id) {
                const productById: IProduct | null = await productService.findProductById(request.query.id as string);
                if (productById === null) {
                    response.sendStatus(HTTP_NOT_FOUND);
                    return;
                }
                response.status(HTTP_OK).json(productById);
            } else {
                response.sendStatus(HTTP_BAD_REQUEST);
            }
        } catch(err) {
            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
    
    app.delete('/products/:product_id', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const deleteResult = await productService.deleteProduct(request.params.product_id);
            response.json(deleteResult);
        } catch(err) {
            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
}
