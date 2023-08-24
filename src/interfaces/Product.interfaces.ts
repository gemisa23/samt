type ID = string | number;

export interface IProduct {
    id: ID,
    name: string,
    sellValue: number
}

export interface IOperationResult {
    success: boolean,
    details: string | object
}

export interface IProductRegisteringData {
    id: ID | null,
    name: string | null,
    sellValue: number | null
}
export interface IListingOptions {
    order: string,
    field: string
}