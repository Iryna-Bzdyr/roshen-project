
export  interface IProduct {
    id:string,
    categoryName:string,
    typeName:string,
    name:string,
    description:string,
    weight:number,
    unitOfMeasurement:string,
    price:number,
    image:string,
    minQuantity:number,
    amountInTheDrawer:string,
    shelfLife:string,
    trademark:string,
    discount?:boolean,    
    newItem?:boolean,
    discountPrice?:number,
}
