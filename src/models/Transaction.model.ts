import { MongoClient, Db, Collection, FindCursor } from "mongodb";
import { IBestSellingProductByValue, IBestSellingProductByUnits, IComputedTransaction, IOperationResult } from "../interfaces/Transaction.interfaces";


interface ITransactionModel {
    bestSellingProductsByValue: (daysAgo: number) => Promise<IBestSellingProductByValue[]>
    bestSellingProductsByUnits: (daysAgo: number) => Promise<IBestSellingProductByUnits[]>
    registerTransaction: (transactionDetails: IComputedTransaction) => Promise<IOperationResult>
    retrieveAll: () => Promise<FindCursor>
}

export default class TransactionModel implements ITransactionModel {

    private dbClient: MongoClient;
    private db: Db;
    private transactions: Collection;

    constructor(dbClient: MongoClient) {
        this.dbClient     = dbClient;
        this.db           = this.dbClient.db('SAM');
        this.transactions = this.db.collection('Transactions');
    }

    /**
     * Para la dimensión del ejercicio se podría haber utilizado un simple find
     * y luego operar de manera síncrona con map/reduce en lugar de pipelines.
     * En un escenario un poco mas realista (con un mayor volumen de datos y peticiones),
     * se optaría por una solución asíncrona como son los pipelines+aggregation. 
     **/

    async bestSellingProductsByValue(daysAgo: number = 30): Promise<IBestSellingProductByValue[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        const pipeline = [
            { $match: { date: { $gte: startDate } } },
            { $unwind: '$products' }, /* Deconstruir a un documento por cada elemento */
            {
                $group: {
                    _id: '$products.productId',
                    productId: { $first: '$products.productId' },
                    productName: { $first: '$products.productName' },
                    totalValueSold: {
                        $sum: { $multiply: ['$products.unitsSold', '$products.sellValue'] }
                    }
                }
            },
            { $sort: { totalValueSold: -1 } },
            { $limit: 1 }
        ];

        const bestSelling = await this.transactions.aggregate<IBestSellingProductByValue>(pipeline).toArray();
        return bestSelling;
    }


    async bestSellingProductsByUnits(daysAgo: number = 30): Promise<IBestSellingProductByUnits[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        const pipeline = [
            { $match: { date: { $gte: startDate } } },
            { $unwind: '$products'},
            {
                $group: {
                    _id: '$products.productId',
                    productId: { $first: '$products.productId' },
                    productName: { $first: '$products.productName' },
                    totalUnitsSold: { $sum: '$products.unitsSold' }
                }
            },
            { $sort: { totalUnitsSold: -1 } },
            { $limit: 1 }
        ];

        const bestSelling = await this.transactions.aggregate<IBestSellingProductByUnits>(pipeline).toArray();
        return bestSelling;
    }


    async registerTransaction(transactionDetails: IComputedTransaction): Promise<IOperationResult> {
        
        await this.transactions.insertOne(transactionDetails);

        return {
            success: true,
            details: transactionDetails
        };

    }

    async retrieveAll(): Promise<FindCursor> {
        return this.transactions.find({});
    }


}