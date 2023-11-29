import { ICategory } from "./ICategory";

export interface IProduct {
    name: string,
    description: string,
    imagePath: string,
    price: number,
    ingredients: ICategory,
    category: string
}