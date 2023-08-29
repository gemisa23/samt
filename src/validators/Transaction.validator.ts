import { IOperationResult } from "../interfaces/Transaction.interfaces";
import ProductService from "../services/Product.service";

export const validateIncomingTransactionFields = async (fields: any, productService: ProductService): Promise<IOperationResult> => {

    /* Should have a date */
    /* Should have a products array of at least one element */
    /* Product should be valid product */

    if (isNaN((new Date(fields.date)).valueOf())) {
        return {
            success: false,
            details: 'Date field should be a valid date string'
        };
    }

    if (!Array.isArray(fields.products) || fields.products.length == 0) {
        return {
            success: false,
            details: 'Transaction should contain a products array that cannot be empty.'
        };
    }


    const ids: string[] = []
    for (let product of fields.products) {
        if (typeof product.productId != 'string') {
            return {
                success: false,
                details: 'The product ID should be a valid string.'
            };
        } 

        if (typeof product.sellValue != 'number' || isNaN(product.sellValue) || product.sellValue < 0) {
            return {
                success: false,
                details: 'The product sellValue should be a valid price (non-negative number)'
            };
        }

        if (typeof product.unitsSold != 'number' || isNaN(product.unitsSold) || product.unitsSold < 1) {
            return {
                success: false,
                details: 'At least one unit should be sold.'
            }
        }

        ids.push(product.productId);
    }

    const idValidation: IOperationResult = await productService.verifyIfAllIDsAreTaken(ids);

    if (!idValidation.success) {
        return idValidation;
    }

    return {
        success: true,
        details: 'Incoming transaction fields OK'
    };



}
