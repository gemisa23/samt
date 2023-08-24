import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { MongoClient } from "mongodb";

import TransactionService from "./services/Transaction.service";
import ProductService from "./services/Product.service";
import loadProductController from "./controllers/Product.controller";
import loadTransactionController from "./controllers/Transaction.controller";

import { APP_ADDR, APP_PORT, DEFAULT_MONGO_URL } from "./config/app";

const build = async (): Promise<void> => {
    try {
        /* Setup DB */
        const app: Express = express();
        const dbClient: MongoClient = new MongoClient(DEFAULT_MONGO_URL);
        await dbClient.connect();

        /* Setup middleware */
        app.use(express.json());
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        /* Setup services & controllers */
        const transactionService = new TransactionService(dbClient);
        const productService = new ProductService(dbClient);
        loadProductController(app, productService);
        loadTransactionController(app, transactionService);

        app.listen(APP_PORT, APP_ADDR, () => { console.log(`Server is running on port ${APP_PORT}`); });

    } catch (error) {
        console.error('Error:', error);
    }
};

build();