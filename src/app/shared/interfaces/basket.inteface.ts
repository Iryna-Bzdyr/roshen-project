export interface IBasket {
    orderProductsName: string,
    orderProductsID: string,
    orderProductsPrice: number,
    orderProductsCount: number,
    orderProductWeight:number,
    orderImage?:string,
    orderProductsDiscountPrice?: number,
    orderProductMinQuality?:number,
    orderUnitOfMeasurement?:string,
    orderProductsSum?:number    
}