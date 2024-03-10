export interface ICategory {
  _id: string
  name: string;
  icon: string;
}

export interface IFullCategory {
  category: ICategory;
  productCount: number;
  products: {
    id: string;
    name: string;
    imagePath: string;
  }[]
}
