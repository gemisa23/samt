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
