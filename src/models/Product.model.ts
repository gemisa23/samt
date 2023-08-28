import { MongoClient, Db, FindCursor, Collection, UpdateResult, DeleteResult } from "mongodb";
import { IOperationResult, IProduct } from "../interfaces/Product.interfaces";


export default class ProductModel {

    private dbClient: MongoClient;
    private db: Db;
    private products: Collection;

    constructor(dbClient: MongoClient) {
        this.dbClient = dbClient;
        this.db       = this.dbClient.db("SAM");
        this.products = this.db.collection('Products');
    }


    async registerNewProduct(product: IProduct): Promise<IOperationResult> {
        const result = await this.products.insertOne(product);
        return {
            success: true,
            details: result
        }
    }


    async updateProduct(product: IProduct): Promise<IOperationResult> {
        const updateResult: UpdateResult = await this.products.updateOne({ id: product.id }, { $set: product });
        console.log('Update Result:', updateResult);
        return {
            success: true,
            details: 'Product updated.'
        };
    }

    async deleteProduct(productId: string): Promise<IOperationResult> {
        const deleteResult: DeleteResult = await this.products.deleteOne({ id: productId });
        if (deleteResult.deletedCount === 1) {
            return {
                success: true,
                details: 'Product deleted successfully.'
            };
        } else {
            return {
                success: false,
                details: 'Product not found.'
            };
        }
    }


    async findOne(query: object): Promise<IProduct | null> {
        const searchResult  = await this.products.findOne(query);
        if (searchResult !== null) {
            /* Agregar { _id: false } */
            const { _id, ...productData } = searchResult;
            return <IProduct>productData;
        }
        return null;
    }

    /* Devuelve un cursor */
    async allProducts(): Promise<FindCursor> {
        const projection = { _id: 0 };
        const cursor: FindCursor = this.products.find({}, { projection });
        return cursor;
    }

}