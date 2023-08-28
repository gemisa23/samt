import { IOperationResult } from "../interfaces/Product.interfaces";

/**
 * Validates the data received for registering a product.
 * @param product 
 * @returns IOperationResult
 */
export const validateRegistrarionProductFields = (product: any): IOperationResult => {

    console.log(product);
    console.log('asdadasd');

    if (typeof product.sellValue != 'number' || product.sellValue !== product.sellValue || product.sellValue < 0) {
        return {
            success: false,
            details: `The provided sell value <${product.sellValue}> is invalid. Expected a valid positive number`
        };
    }

    if (!Reflect.has(product, 'name') || typeof product.name != 'string' || product.name.length < 1) {
        return {
            success: false,
            details: `A valid string field <name> was expected. Received ${product.name}`
        };
    }

    if (!Reflect.has(product, 'id') || typeof product.id != 'string' || product.name.length < 1) {
        return {
            success: false,
            details: `A valid string field <id> was expected. Received ${product.id}`
        };
    }

    return {
        success: true,
        details: 'Structure ok'
    };
    
}


/**
 * Validates the fields received for updating a product.
 * @param fields Any object to be validated.
 * @returns IOperationResult
 */
export const validateUpdateFields = (fields: any): IOperationResult => {

    /* Validate all the keys are valid*/
    const receivedKeys: string[] = Reflect.ownKeys(fields) as string[];

    for (let i = 0; i < receivedKeys.length; i++) {

        const key = receivedKeys[i];

        if (!['sellValue', 'id', 'name'].includes(key)) {
            return {
                success: false,
                details: `Invalid field ${key}`
            };
        }
  
    }

    /* ID is required*/
    if (!fields.id) {
        return {
            success: false,
            details: 'Missing or invalid id.'
        };
    }

    if (Reflect.has(fields, 'name') && (typeof fields.name != 'string' || fields.name.length < 1)) {
        return {
            success: false,
            details: `Field <name> should be a string.`
        }
    }

    if (Reflect.has(fields, 'sellValue')) {
        if (typeof fields.sellValue != 'number' || fields.sellValue !== fields.sellValue || fields.sellValue < 0) {
            return {
                success: false,
                details: `Invalid field value <${fields.sellValue}> for field sellValue`
            }
        }
    }

    return {
        success: true,
        details: 'Update fields ok.'
    };

}