import { MongoClient, Db, Collection } from "mongodb";
import { IBestSellingProductByValue, IBestSellingProductByUnits } from "../interfaces/Transaction.interfaces";


export default class TransactionModel {

    private dbClient: MongoClient;
    private db: Db;
    private transactions: Collection;

    constructor(dbClient: MongoClient) {
        this.dbClient     = dbClient;
        this.db           = this.dbClient.db('SAM');
        this.transactions = this.db.collection('Transactions');
    }


    async bestSellingProductsByValue(daysAgo: number = 30): Promise<IBestSellingProductByValue[]> {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);
    
            const pipeline = [
                { $match: { date: { $gte: startDate } } },
                { $unwind: '$products' },
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
        } catch(err) {
            throw err;
        }

    }


    async bestSellingProductsByUnits(daysAgo: number = 30): Promise<IBestSellingProductByUnits[]> {
        try {
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
        } catch(err) {
            throw err;
        }
    }

}