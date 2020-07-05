import { ICategory } from './../interfaces/category.interface';
import { IType } from './../interfaces/type.interface';

export class Type implements IType, ICategory{
    constructor(
    public categoryName:string,
    public typeName:string,
    public typeID:number
    ){}
}