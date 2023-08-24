import { Express, NextFunction, Request, Response } from "express";
import TransactionService from "../services/Transaction.service";


const DEFAULT_TIMEFRAME: number = 30;

export default (app: Express, transactionService: TransactionService): void => {
    app.get('/products/best_selling/by_units', async (request: Request, response: Response, next: NextFunction) => {
        const daysAgo = parseInt(request.query.daysAgo as string, 10) || 30;
        if (isNaN(daysAgo)) {
            response.status(400).json({
                error: `Invalid <daysAgo> query parameter. Expected a number, got ${request.query.daysAgo}`
            });
            return;
        }
        const products = await transactionService.bestSellingProductsByUnits(daysAgo);
        response.json(products);
    });

    app.get('/products/best_selling/by_value', async (request: Request, response: Response, next: NextFunction) => {
        const daysAgo = parseInt(request.query.daysAgo as string, 10) || DEFAULT_TIMEFRAME;
        if (isNaN(daysAgo)) {
            response.status(400).json({
                error: `Invalid <daysAgo> query parameter. Expected a number, got ${request.query.daysAgo}`
            });
            return;
        }
        const products = await transactionService.bestSellingProductsByValue(daysAgo);
        response.json(products);
    });
}
