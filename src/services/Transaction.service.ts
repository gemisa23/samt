import { MongoClient, Db, Collection, FindCursor } from "mongodb";


interface IBestSellingProductByUnits {
    _id: string,
    productId: string
    productName: string,
    totalUnitsSold: number,
}

interface IBestSellingProductByValue {
    _id: string,
    productId: string,
    productName: string,
    totalValueSold: number
}


export default class TransactionService {

    private dbClient: MongoClient;
    private db: Db;
    private transactions: Collection;

    constructor(dbClient: MongoClient) {
        this.dbClient     = dbClient;
        this.db           = this.dbClient.db('SAM');
        this.transactions = this.db.collection('Transactions');
    }


    async bestSellingProductsByValue(daysAgo: number = 30): Promise<IBestSellingProductByValue[]> {
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

}