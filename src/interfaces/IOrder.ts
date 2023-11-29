
export interface IOrder {
    table: string,
    status: [string, string, string],
    createdAt: Date,
    products: {
        product: string,
        quantity: number
    }
}