import { MongoClient, WithId, FindCursor, Collection, UpdateResult, DeleteResult } from "mongodb";
import { IOperationResult, IProduct } from "../interfaces/Product.interfaces";


export default class ProductModel {

    private dbClient;
    private db;
    private products;

    constructor(dbClient: MongoClient) {
        this.dbClient = dbClient;
        this.db       = this.dbClient.db("SAM");
        this.products = this.db.collection('Products');
    }


    async registerNewProduct(product: IProduct): Promise<IOperationResult> {
        // - PENDING: Verify if ID is already taken.
        try {
            const collection = this.db.collection('Products');
            const result = await collection.insertOne(product);
            return <IOperationResult>{
                success: true,
                details: result
            }
        } catch(error) {
            throw error;
        }
    }


    async updateProduct(product: IProduct): Promise<IOperationResult> {
        const productsCollection: Collection<IProduct> = this.db.collection('Products');
        try {
            const updateResult: UpdateResult = await productsCollection.updateOne({ id: product.id }, { $set: product });
            console.log('Update Result:', updateResult);
            return <IOperationResult>{
                success: true,
                details: 'Product updated.'
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId: string): Promise<IOperationResult> {
        const productsCollection: Collection<IProduct> = this.db.collection('Products');
    
        try {
            const deleteResult: DeleteResult = await productsCollection.deleteOne({ id: productId });
            if (deleteResult.deletedCount === 1) {
                console.log('Product deleted successfully.');
                return {
                    success: true,
                    details: 'Product deleted successfully.'
                };
            } else {
                console.log('Product not found.');
                return {
                    success: false,
                    details: 'Product not found.'
                };
            }
        } catch (error) {
            throw error;
        }
    }


    async findOne(query: object): Promise<IProduct | null> {
        try {
            const searchResult  = await this.products.findOne(query);
            if (searchResult !== null) {
                /* Agregar { _id: false } */
                const { _id, ...productData } = searchResult;
                return <IProduct>productData;
            }
            return null;
        } catch(error) {
            throw error;
        }
    }

    /* Devuelve un cursor */
    async allProducts(): Promise<FindCursor> {
        const projection = { _id: 0 };
        const cursor: FindCursor = this.products.find({}, { projection });
        return cursor;
    }

}