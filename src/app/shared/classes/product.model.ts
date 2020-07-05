import { IType } from './../interfaces/type.interface';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from '../interfaces/product.interface';

export class Product implements IProduct, ICategory, IType{
    constructor(
        public id:string,
        public categoryName:string,
        public typeName:string,
        public name:string,
        public description:string,
        public weight:number,
        public unitOfMeasurement:string,
        public price:number,
        public image:string,      
        public minQuantity:number,
        public amountInTheDrawer:string,
        public shelfLife:string,       
        public trademark:string,
        public discount?: boolean,       
        public newItem?:boolean,
        public discountPrice?:number,
    ){}
}

