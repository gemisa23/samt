import { MongoClient, Db, Collection, FindCursor } from "mongodb";
import TransactionModel from "../models/Transaction.model";
import { IBestSellingProductByValue, IBestSellingProductByUnits, IIncomingTransaction, IComputedTransaction } from "../interfaces/Transaction.interfaces";
import { IOperationResult } from "../interfaces/Product.interfaces";
import ProductService from "./Product.service";
import { validateIncomingTransactionFields } from "../validators/Transaction.validator";


interface ITransactionService {
    bestSellingProductsByValue: (daysAgo: number) =>  Promise<IBestSellingProductByValue[] | null>,
    bestSellingProductsByUnits: (daysAgo: number) => Promise<IBestSellingProductByUnits[] | null>,
    registerTransaction: (transactionDetails: IIncomingTransaction) => Promise<IOperationResult>,
    setProductService: (p: ProductService) => void,
    isThereAnyTransactionRegisted: () => Promise<boolean>
}
export default class TransactionService implements ITransactionService {

    private dbClient: MongoClient;
    private db: Db;
    private transactionModel: TransactionModel;
    private productService: ProductService | null;

    constructor(dbClient: MongoClient) {
        this.dbClient     = dbClient;
        this.db           = this.dbClient.db('SAM');
        this.transactionModel = new TransactionModel(this.dbClient);
        this.productService = null;
    }


    async bestSellingProductsByValue(daysAgo: number = 30): Promise<IBestSellingProductByValue[] | null> {
        try {

            if (!await this.isThereAnyTransactionRegisted()) {
                return null;
            }

            return await this.transactionModel.bestSellingProductsByValue(daysAgo);
        } catch(err) {
            throw err;
        }
        
    }

    async bestSellingProductsByUnits(daysAgo: number = 30): Promise<IBestSellingProductByUnits[] | null> {
        try {

            if (!await this.isThereAnyTransactionRegisted()) {
                return null;
            }

            return await this.transactionModel.bestSellingProductsByUnits(daysAgo);
        } catch(err) {
            throw err;
        }
    }

    async isThereAnyTransactionRegisted(): Promise<boolean> {
        try {
            const findResult: FindCursor = await this.transactionModel.retrieveAll();
            const findResultArray = await findResult.toArray();
            return findResultArray.length > 0;
        } catch(err) {
            throw err;
        }
    }

    async registerTransaction(transactionDetails: IIncomingTransaction): Promise<IOperationResult> {
        try {

            const validation: IOperationResult = await validateIncomingTransactionFields(transactionDetails, this.productService as ProductService);

            if (!validation.success) {
                return validation;
            }

            const cTransaction: IComputedTransaction = {
                date: new Date(transactionDetails.date || new Date()),
                products: transactionDetails.products
            };
    
            /* Validate all the product's ids corresponds to registered products */
            await (this.productService as ProductService).validateIds(
                cTransaction.products.map(p => p.productId)
            );
    
            return await this.transactionModel.registerTransaction(cTransaction);

        } catch(err) {
            throw err;
        }

    }


    setProductService(p: ProductService) {
        this.productService = p;
    }

}