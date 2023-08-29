export interface IBestSellingProductByUnits {
    _id: string,
    productId: string
    productName: string,
    totalUnitsSold: number,
}

export interface IBestSellingProductByValue {
    _id: string,
    productId: string,
    productName: string,
    totalValueSold: number
}

export interface ITransactionRegisteringProduct  {
    productId: string,
    productName: string,
    sellValue: number,
    unitsSold: number,
}


export interface IIncomingTransaction {
    date: string | null | undefined,
    products: ITransactionRegisteringProduct[]
}

export interface IComputedTransaction {
    date: Date,
    products: ITransactionRegisteringProduct[]
}

export interface IOperationResult {
    success: boolean,
    details: string | object
}
