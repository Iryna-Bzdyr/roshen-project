import { ICategory } from './../interfaces/category.interface';

export class Category implements ICategory {
    constructor(
        public categoryID: number,
        public categoryName: string,
        public categoryImg?:string,
        public icon?:string,
        public iconHover?:string
    ) { }
}