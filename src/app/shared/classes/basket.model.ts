import { IBasket } from './../interfaces/basket.inteface';

export class Basket implements IBasket {
    constructor(
      public  orderProductsName: string,
      public  orderProductsID: string,
      public  orderProductsPrice: number,
      public  orderProductsCount: number,
      public  orderProductWeight:number,
      public  orderImage?:string,
      public  orderProductsDiscountPrice?: number,
      public  orderProductMinQuality?:number,
      public  orderUnitOfMeasurement?:string,
      public  orderProductsSum?:number
    ) { }
}