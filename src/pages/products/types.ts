export interface User {
  firstname: string;
  lastname: string;
  email: string;
}

export interface Product {
  data: {
    id: string;
    name: string;
    price: number;
    img: string;
    description: string;
    count: number;
    skidka: number;
    categoryId: string;
    userId: string;
    createdAt: string;
    colors: ColorList[];
    category: CategoryList;
    likes: any[];
    comments: any[];
    totalLikes: number;
    discountedPrice: number;
    avgStars: string;
  }[]
}

export interface CategoryList {
  id: string;
  name: string;
}

export interface ColorList {
  id: string;
  name: string;
}
