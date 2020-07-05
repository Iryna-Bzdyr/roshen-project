import { Component, OnInit, HostListener } from '@angular/core';
import { IBasket } from 'src/app/shared/interfaces/basket.inteface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSticky: boolean = false;
   productBasket:Array<IBasket> = []
   sumArr = []
   orderSum:number

  constructor() { }

  ngOnInit() {
    this.productBasket = JSON.parse(localStorage.getItem('productBasket'))
    
    
  }



  getSum():number{
    this.sumArr = this.productBasket.map(p=>p.orderProductsSum)
    this.orderSum = this.sumArr.reduce((a,b)=>a+b)
    return  this.orderSum
  }



  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  } 
}
