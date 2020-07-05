import { PAGES } from './../../shared/classes/pager.arr';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Basket } from './../../shared/classes/basket.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { Component, OnInit, Inject, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AosToken } from '../../aos';
import { IBasket } from 'src/app/shared/interfaces/basket.inteface';
import { CategoryService } from 'src/app/shared/services/category.service.service';
import { TypeService } from 'src/app/shared/services/type.service';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { IPager } from 'src/app/shared/interfaces/pager.intefrace';
import { Pager } from 'src/app/shared/classes/pager.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';





@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
 
})
export class ProductsComponent implements OnInit {
  products:Array<IProduct> = []
  categories:Array<ICategory>= []
  types:Array<IType> = []
  pagerArr=PAGES
  productBasket:Array<IBasket> = []
  filterCategoty:string = ''
  filterType:string =''
  hoverCategory:string =''
  currentID: number 
//For paginator---------------------------------------------
  pagesCount:number = null
  arrayLendth:number = null
  start:number = null
  end:number = null
  sliseIndex:number = 8
  isActive:boolean = false
  typeActiveIndex:number 
  productIndex:number
//----------------------------------------------------------

  count:number
  startQuality:number
  basketProductIndex:number
  sum:number 
  totalWeight:number 
 

  isSticky: boolean = false; 
  modalRef: BsModalRef;
  message: string;

//For modal-----------------------------------------------------------
productID:string
productName:string
productDescription:string
productWeight:number
productUnitOfMeasurement:string
productPrise:number
productIMG:string
productMinQuantity:number
productAmountInTheDrawer:string
productShelfLife:string
productTrademark:string
productDiscount:boolean
productNewItem:boolean
productDiscounPrice:number

  constructor(private prs:ProductService , 
              private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private typeService: TypeService,
              private modalService: BsModalService,
              @Inject(AosToken) aos) {
                aos.init();
                this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.getProducts();
                  }
              });
            }


  ngOnInit() {
    this.getCategories()
    
    // console.log(localStorage.length)
    // console.log(this.route.snapshot.paramMap.keys)  
  }

  openModal(template: TemplateRef<any>, id:string)  {
    this.modalRef = this.modalService.show(template, {class: 'modal-window modal-lg'});
    this.findIndex(id)
    this.productID = this.products[this.productIndex].id
    this.productName = this.products[this.productIndex].name
    this.productDescription = this.products[this.productIndex].description
    this.productUnitOfMeasurement = this.products[this.productIndex].unitOfMeasurement
    if(this.productUnitOfMeasurement=='кг'){
      this.productWeight = this.products[this.productIndex].weight/1000  
    }
    if(this.productUnitOfMeasurement=='шт'){
      this.productWeight = this.products[this.productIndex].weight 
    }

    this.productPrise = this.products[this.productIndex].price
    this.productIMG = this.products[this.productIndex].image
    this.productMinQuantity = this.products[this.productIndex].minQuantity
    this.productAmountInTheDrawer = this.products[this.productIndex].amountInTheDrawer
    this.productShelfLife = this.products[this.productIndex].shelfLife
    this.productTrademark = this.products[this.productIndex].trademark
    this.productDiscount = this.products[this.productIndex].discount
    this.productNewItem = this.products[this.productIndex].newItem
    this.productDiscounPrice = this.products[this.productIndex].discountPrice

    if(localStorage.length>0&&localStorage.getItem('productBasket')){
      this.productBasket = JSON.parse(localStorage.getItem('productBasket'))
      this.findBascketIndex(this.productID)
      if(this.basketProductIndex>=0){
      this.count = this.productBasket[this.basketProductIndex].orderProductsCount
      document.getElementById('addButton').innerHTML = 'Змінити'
    } 
      
      else{
        if(this.productUnitOfMeasurement=='кг'){
          this.count = 1
        }
        if(this.productUnitOfMeasurement=='шт'){
          this.count = this.productMinQuantity
        }
      }
    }
    else{
      if(this.productUnitOfMeasurement=='кг'){
        this.count = 1
      }
      if(this.productUnitOfMeasurement=='шт'){
        this.count = this.productMinQuantity
      }
    }
  this.findSum()
  this.findWeight()
  }

 findIndex(id:string) {
  this.productIndex = this.products.findIndex(index => index.id === id)
  return this.productIndex 
}

onCountChange(){
  this.findSum()
  this.findWeight()
}

countPlus(){
  this.count +=1
  if(this.count<this.productMinQuantity&&this.productUnitOfMeasurement=='шт'){
    this.count = this.productMinQuantity
  }
  this.onCountChange()
}

countMinus(){
  this.count -=1
  if(this.count<this.productMinQuantity&&this.productUnitOfMeasurement=='шт'){
    this.count = 0
  }
  this.onCountChange()
}

findSum():number{
  if(this.productUnitOfMeasurement==='кг'){
    if(this.productDiscount){
      this.sum = this.count * this.productMinQuantity * this.productDiscounPrice
    }
    if(!this.productDiscount){
      this.sum = this.count * this.productMinQuantity * this.productPrise
    }
  
  }
  if(this.productUnitOfMeasurement==='шт'){
    
    if(this.productDiscount){
      this.sum = this.count * this.productDiscounPrice
    }
    if(!this.productDiscount){
      this.sum = this.count * this.productPrise
    }
  
  }
  return this.sum
}

findWeight():number{
  if(this.productUnitOfMeasurement=='кг'){
    
    this.totalWeight = this.count * this.productMinQuantity
  }
  if(this.productUnitOfMeasurement==='шт'){
    
   this.totalWeight = this.count * this.productWeight / 1000
  }
  return this.totalWeight
}


addProduct(){
 if(this.productUnitOfMeasurement=='шт'&&this.count<this.productMinQuantity){
  document.getElementById('message').style.display = 'block'
 }
  else{
  this.findSum()
  this.findWeight()

  const newBacketProduct:IBasket = new Basket(
    this.productName,
    this.productID,
    this.productPrise,
    this.count,
    this.totalWeight,
    this.productIMG,
    this.productDiscounPrice, 
    this.productMinQuantity,
    this.productUnitOfMeasurement,
    this.sum   
  )

  if(localStorage.length>0&&localStorage.getItem('productBasket')){
         this.productBasket = JSON.parse(localStorage.getItem('productBasket'))
         this.findBascketIndex(this.productID)
         if(this.basketProductIndex>=0){
          this.productBasket.splice(this.basketProductIndex,1)
          this.productBasket.push(newBacketProduct)
         }
        else{
          this.productBasket.push(newBacketProduct)
        }
       }
       else{
        this.productBasket.push(newBacketProduct)
      }       
localStorage.setItem('productBasket',JSON.stringify(this.productBasket))
this.modalRef.hide();
document.getElementById('message').style.display = 'none'
  }
}



findBascketIndex(id:string) {
  this.basketProductIndex = this.productBasket.findIndex(index => index.orderProductsID === id)
  console.log(this.basketProductIndex)
  return this.basketProductIndex 
}



  private getProducts(): number {
    let category = this.route.snapshot.paramMap.get('category').slice(1, this.route.snapshot.paramMap.get('category').length )
    let type = ''
    if(this.route.snapshot.paramMap.has('type')){
      type  = this.route.snapshot.paramMap.get('type').slice(1, this.route.snapshot.paramMap.get('type').length )
    }
    
    
    this.prs.getJSONProduct().subscribe(
      data => { 
        
        if(this.route.snapshot.paramMap.has('type')){
          this.products = data.filter(p=> p.typeName===type); 
          this.filterCategoty = category
          this.filterType = type
          this.getTypes()
          this.arrayLendth = this.products.length
          this.createPagginator()
          setTimeout(() => {
            this.sliceProduct(0,this.sliseIndex,0)
           }, 0.1);
           this.gotoTop()
        }
                
        else{
          this.products = data.filter(p=> p.categoryName===category); 
          this.filterCategoty = category 
          this.getTypes() 
          this.arrayLendth = this.products.length
          this.createPagginator()
          setTimeout(() => {
            this.sliceProduct(0,this.sliseIndex,0)
           }, 0.1);
           this.gotoTop()
        }  
      },
      err => {
        console.log(err);
      }
    );
    return this.products.length
  }
//--------------------------------------------------------------------------------------
private getCategories(): void {
  this.categoryService.getJSONCategory().subscribe(
    data => {
      this.categories = data  
    },
    err => {
      console.log(err)
    }
  )
}
//-----------------------------------------------------------------------------------------
getTypes(): void {  
  this.typeService.getJSONTypes().subscribe(
    data => {
      this.types = data.filter(p=> p.categoryName=== this.filterCategoty); 
    },
    err => {
      console.log(err);
    }
  );
}

onHover(category):void{
  this.hoverCategory = category 
}

onHoverOver():void{
  this.hoverCategory = ''

}

onClick(category):void{
  this.filterCategoty = category 
  this.prs.getJSONProduct().subscribe(
    data => {
      this.products = data.filter(p=> p.categoryName=== category);  
      this.getTypes()
      this.filterType = ''
      this.arrayLendth = this.products.length
      this.createPagginator()
     setTimeout(() => {
      this.sliceProduct(0,this.sliseIndex,0)
     }, 0.1);
     this.gotoTop()
    },
    err => {
      console.log(err);
    }
  ); 
}

onClickType(type, id):void{
  // this.filterType = type
  this.prs.getJSONProduct().subscribe(
    data => {
      this.products = data.filter(p=> p.typeName === type); 
      this.filterType = type     
      this.getTypes()   
      this.typeActiveIndex = id

      this.arrayLendth = this.products.length
      this.createPagginator()
     setTimeout(() => {
      this.sliceProduct(0,this.sliseIndex,0)    
     }, 0.1);
     setTimeout(() => {
      document.querySelectorAll('.type-block').forEach(el=>(el.classList.remove('active-type')))
      document.querySelectorAll('.type-block')[this.typeActiveIndex].classList.add('active-type') 
     }, 1000);
    this.gotoTop()
    },
    err => {
      console.log(err);
    }
  );
}

sliceProduct(start:number, end:number, index:number):void{ 
  if(this.filterType){
    this.prs.getJSONProduct().subscribe(
      data => {
        this.products = data.filter(p=> p.typeName===this.filterType); 
        this.products = this.products.slice(start,end)    
           
      },
    ) 
  }
else{
  this.prs.getJSONProduct().subscribe(
    data => {
      this.products = data.filter(p=> p.categoryName===this.filterCategoty); 
      this.products = this.products.slice(start,end)    
        
    },
  ) 
}
if(this.pagesCount>1){
document.querySelectorAll('.pagination').forEach(el=>(el.classList.remove('active')))
document.querySelectorAll('.pagination')[index].classList.add('active')
}
this.gotoTop()
}



createPagginator():void{
  this.pagerArr = []
  this.pagesCount = Math.ceil(this.arrayLendth / this.sliseIndex)
  
  if(this.pagesCount>1){
    for (let i = 0; i < this.pagesCount; i++) {
      
      this.start = i*this.sliseIndex
      this.end = (i+1)*this.sliseIndex

      const newPage:IPager = new Pager(
        this.start,
        this.end
      )
      this.pagerArr.push(newPage)
  }
  }
  
}
gotoTop() {
  window.scroll({ 
    top: 0, 
    left: 0, 
    // behavior: 'smooth' 
  });
}

@HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 200;
    
  } 

changeScaleOnmouseOver(i):void{
  document.querySelectorAll('.product-card-wrapper')[i].classList.remove('product-card-mouse-leave')
  document.querySelectorAll('.product-card-wrapper')[i].classList.add('product-card-mouse-over')
}

changeScaleOnmouseLaeve(i):void{
  document.querySelectorAll('.product-card-wrapper')[i].classList.remove('product-card-mouse-over')
  document.querySelectorAll('.product-card-wrapper')[i].classList.add('product-card-mouse-leave')
  
}

changeScaleOnmouseOver2(i):void{
  document.querySelectorAll('.product-card-wrapper2')[i].classList.remove('product-card-mouse-leave')
  document.querySelectorAll('.product-card-wrapper2')[i].classList.add('product-card-mouse-over')
}

changeScaleOnmouseLaeve2(i):void{
  document.querySelectorAll('.product-card-wrapper2')[i].classList.remove('product-card-mouse-over')
  document.querySelectorAll('.product-card-wrapper2')[i].classList.add('product-card-mouse-leave')
  
}

firstList(i):void{
  document.getElementById('first-type').style.display = 'block'
  document.getElementById('second-type').style.display = 'none'
  document.querySelectorAll('.fas').forEach(el=>(el.classList.remove('list-active')))
document.querySelectorAll('.fas')[i].classList.add('list-active')
}
secondList(i):void{
  document.getElementById('second-type').style.display = 'block'
  document.getElementById('first-type').style.display = 'none'
  document.querySelectorAll('.fas').forEach(el=>(el.classList.remove('list-active')))
document.querySelectorAll('.fas')[i].classList.add('list-active')
}

}


