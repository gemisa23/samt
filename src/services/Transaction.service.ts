import { MongoClient, Db, Collection } from "mongodb";
import TransactionModel from "../models/Transaction.model";
import { IBestSellingProductByValue, IBestSellingProductByUnits } from "../interfaces/Transaction.interfaces";

export default class TransactionService {

    private dbClient: MongoClient;
    private db: Db;
    private transactions: Collection;
    private transactionModel: TransactionModel;

    constructor(dbClient: MongoClient) {
        this.dbClient     = dbClient;
        this.db           = this.dbClient.db('SAM');
        this.transactions = this.db.collection('Transactions');
        this.transactionModel = new TransactionModel(this.dbClient);
    }


    async bestSellingProductsByValue(daysAgo: number = 30): Promise<IBestSellingProductByValue[]> {
        try {
            return await this.transactionModel.bestSellingProductsByValue(daysAgo);
        } catch(err) {
            throw err;
        }
        
    }

    async bestSellingProductsByUnits(daysAgo: number = 30): Promise<IBestSellingProductByUnits[]> {
        try {
            return await this.transactionModel.bestSellingProductsByUnits(daysAgo);
        } catch(err) {
            throw err;
        }
    }

}