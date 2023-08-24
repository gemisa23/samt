import { FindCursor, MongoClient } from "mongodb";

import { IProduct } from "../interfaces/Product.interfaces";
import ProductModel from "../models/Product.model";



interface IOperationResult {
    success: boolean,
    details: string | null
}

interface IListingOptions {
    order: string,
    field: string
}

const SORTINGS = Object.freeze({
    desc : -1,
    asc  : 1
});

export default class ProductService {

    private productModel: ProductModel;

    constructor(dbClient: MongoClient) {
        this.productModel = new ProductModel(dbClient);
    }

    async registerNewProduct(product: IProduct): Promise<IOperationResult> {
        try {
            /* PENDING: Validate the product does not exist already. */
            if (await this.productModel.findOne({ id: product.id }) !== null) {
                return {
                    success: false,
                    details: `The id ${product.id} is already taken.`
                };
            }
            await this.productModel.registerNewProduct(product);
            return {
                success: true,
                details: 'Product registered correctly.'
            };
        } catch(err) {
            throw err;
        }
    }


    async findProductByName(name: string): Promise<IProduct | null> {
        return await this.productModel.findOne({ name });
    }

    async findProductById(id: string): Promise<IProduct | null> {
        return await this.productModel.findOne({ id });
    }


    async listAllProducts(listingOptions: IListingOptions): Promise<Array<IProduct>> {
        const productsCursor: FindCursor = await this.productModel.allProducts();
        const sortOptions = { [ listingOptions.field] : listingOptions.order as keyof typeof SORTINGS };
        const sortedProducts: Array<IProduct> = await productsCursor.sort(sortOptions).toArray();
        return sortedProducts;
    }

    async updateProduct(product: IProduct | void): Promise<IOperationResult> {
        /* PENDING: Validate product */
        const updateResult = await this.productModel.updateProduct(product as IProduct);
        return <IOperationResult>updateResult;
    }

    async deleteProduct(productID: string) {
        const deleteResult = await this.productModel.deleteProduct(productID);
        return <IOperationResult>deleteResult;
    }

}





