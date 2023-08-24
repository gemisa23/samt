import { IOperationResult } from "../interfaces/Product.interfaces";

/**
 * Validates the data received for registering a product.
 * @param product 
 * @returns IOperationResult
 */
export const validateRegistrarionProductFields = (product: any): IOperationResult => {

    if (!Number(product.sellValue)) {
        return {
            success: false,
            details: `The provided sell value <${product.sellValue}> is invalid. Expected a number`
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
export const validateUpdateFields = (fields: object): IOperationResult => {

    const receivedKeys: string[] = Reflect.ownKeys(fields) as string[];

    for (let i = 0; i < receivedKeys.length; i++) {

        const key = receivedKeys[i];

        if (!['sellValue', 'id', 'name'].includes(key)) {
            return {
                success: false,
                details: `Invalid field ${key}`
            };
        }
        const v: string | number | unknown = fields[key as string as keyof typeof fields]
        switch(key) {
            case 'sellValue': 
                if (isNaN(Number(v))) {
                    return {
                        success: false,
                        details: `Invalid field value <${v}> for field <sellValue>`
                    };
                }
            case 'id':
            case 'name':
                if ((v as string).length < 1 || typeof v != 'string') {
                    return {
                        success: false,
                        details: `Invalid field value <${v}> for field <${key}>`
                    };
                }
        }

    }

    return {
        success: true,
        details: 'Update fields ok.'
    };

}