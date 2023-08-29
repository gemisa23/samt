import { Express, NextFunction, Request, Response } from "express";
import TransactionService from "../services/Transaction.service";
import { DEFAULT_TIMEFRAME } from "../config/app";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK } from "../helpers/status_codes";
import { IProduct } from "../interfaces/Product.interfaces";
import { IBestSellingProductByUnits, IBestSellingProductByValue } from "../interfaces/Transaction.interfaces";



export default (app: Express, transactionService: TransactionService): void => {
    
    app.get('/products/best_selling/by_units', async (request: Request, response: Response, next: NextFunction) => {
        try {

            const daysAgo = parseInt(request.query.daysAgo as string, 10) || DEFAULT_TIMEFRAME;

            if (isNaN(daysAgo)) {
                response.status(HTTP_BAD_REQUEST).json({
                    error: `Invalid <daysAgo> query parameter. Expected a number, got ${request.query.daysAgo}`
                });

                return;
            }

            const products: IBestSellingProductByUnits[] | null = await transactionService.bestSellingProductsByUnits(daysAgo);

            response.status(HTTP_OK).json(products);

        } catch(err) {

            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);

        }
    });

    app.get('/products/best_selling/by_value', async (request: Request, response: Response, next: NextFunction) => {
        try {

            const daysAgo: number = parseInt(request.query.daysAgo as string, 10) || DEFAULT_TIMEFRAME;

            if (isNaN(daysAgo)) {

                response.status(HTTP_BAD_REQUEST).json({
                    error: `Invalid <daysAgo> query parameter. Expected a number, got ${request.query.daysAgo}`
                });

                return;
            }

            const products: IBestSellingProductByValue[] | null = await transactionService.bestSellingProductsByValue(daysAgo);

            response.status(HTTP_OK).json(products);

        } catch(err) {

            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);

        }
    });

    app.post('/transactions', async (request: Request, response: Response, next: NextFunction) => {

        try {

            const result = await transactionService.registerTransaction(request.body);

            if (result.success) {

                response.status(HTTP_OK).json(result);

                return;
            }

            response.status(HTTP_BAD_REQUEST).json(result);

        } catch(err) {

            response.sendStatus(HTTP_INTERNAL_SERVER_ERROR);
        }
    });
}
