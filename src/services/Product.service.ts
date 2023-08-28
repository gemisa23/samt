import { FindCursor, MongoClient } from "mongodb";
import { IListingOptions, IOperationResult, IProduct } from "../interfaces/Product.interfaces";
import ProductModel from "../models/Product.model";
import { validateRegistrarionProductFields, validateUpdateFields } from "../validators/Product.validator";

const SORTINGS = Object.freeze({
    desc : -1,
    asc  : 1
});

export default class ProductService {

    private productModel: ProductModel;

    constructor(dbClient: MongoClient) {
        this.productModel = new ProductModel(dbClient);
    }

    /**
     * Los errores 
     */

    async registerNewProduct(product: IProduct): Promise<IOperationResult> {
        try {
            /* Validate product fields */
            const validationResult = validateRegistrarionProductFields(product);
            if (!validationResult.success) {
                return validationResult;
            }
            /*  Check product existence */
            if (await this.productModel.findOne({ id: product.id }) !== null) {
                return {
                    success: false,
                    details: `The id ${product.id} is already taken.`
                };
            }

            const registrationResult = await this.productModel.registerNewProduct(product);
            return registrationResult;

        } catch(err) {
            throw err;
        }
    }


    async findProductByName(name: string): Promise<IProduct | null> {
        try {
            return await this.productModel.findOne({ name }); 
        } catch(err) {
            throw err;
        }
    }

    async findProductById(id: string): Promise<IProduct | null> {
        try {
            return await this.productModel.findOne({ id });
        } catch(err) {
            throw err;
        }
    }

    async listAllProducts(listingOptions: IListingOptions): Promise<Array<IProduct>> {
        try {
            const productsCursor: FindCursor = await this.productModel.allProducts();
            const sortOptions = { [ listingOptions.field] : listingOptions.order as keyof typeof SORTINGS };
            const sortedProducts: Array<IProduct> = await productsCursor.sort(sortOptions).toArray();
            return sortedProducts;
        } catch(err) {
            throw err;
        }
    }

    async updateProduct(product: IProduct): Promise<IOperationResult> {
        try {
            if (!await this.productModel.findOne({ id: product.id })) {
                return {
                    success: false,
                    details: 'An id is required for updating a product, and it should match an existing product id.'
                };
            };
            const updateValidation = validateUpdateFields(product as object);
            if (!updateValidation.success) {
                return updateValidation;
            }
            const updateResult = await this.productModel.updateProduct(product as IProduct);
            return updateResult;
        } catch(err) {
            throw err;
        }
    }

    async deleteProduct(productID: string): Promise<IOperationResult>  {
        try {
            if (!await this.productModel.findOne({ id: productID })) {
                return {
                    success: false,
                    details: 'A valid id is required for updating a product, and it should match an existing product id.'
                };
            };
            const deleteResult = await this.productModel.deleteProduct(productID);
            return deleteResult;
        } catch(err) {
            throw err;
        }
    }

}





