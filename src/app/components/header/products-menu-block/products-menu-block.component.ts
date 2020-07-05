import { Component, OnInit, Inject } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryService } from 'src/app/shared/services/category.service.service';
import { TypeService } from 'src/app/shared/services/type.service';
import { Router } from '@angular/router';
import { AosToken } from 'src/app/aos';

@Component({
  selector: 'app-products-menu-block',
  templateUrl: './products-menu-block.component.html',
  styleUrls: ['./products-menu-block.component.scss']
})
export class ProductsMenuBlockComponent implements OnInit {
  menu
  products: Array<IProduct> = [];
  categories: Array<ICategory>=[]
  types: Array<IType>=[]
  constructor(private productsService: ProductService,
              private categoryService: CategoryService, 
              private typeService: TypeService,
              private router: Router,
              @Inject(AosToken) aos) {
                aos.init();
    
            }

  ngOnInit() {
    this.getCategories()
  }
  private getCategories(): void {
    this.categoryService.getJSONCategory().subscribe(
      data=>{
        this.categories = data
      },
      err => {
        console.log(err)
      }
    )
    }
    filterType($event, category, top): void {  
      document.getElementById('type-menu').style.display = 'none'     
      this.typeService.getJSONTypes().subscribe(
        data => {
          this.types = data.filter(p=> p.categoryName === category);
         
        },
        err => {
          console.log(err);
        }
      );
     setTimeout(() => {
      document.querySelectorAll('.category-item').forEach(el=>(el.classList.remove('active'))) 
      document.getElementById('type-menu').style.display = 'flex'
      let topSize = top*7
      document.getElementById('type-menu').style.top = `${topSize}%`
      document.querySelectorAll('.category-item')[top].classList.add('active')
     }, 50);
  }


typeFadeDown(){
  document.getElementById('type-menu').style.display = 'none' 
}

categoryFadeUp(){
  document.getElementById('category-menu').style.display = 'block'  
  document.getElementById('fixed').style.display = 'block' 
}

fadaDownAll(){
  document.getElementById('type-menu').style.display = 'none'   
    document.getElementById('category-menu').style.display = 'none' 
    document.getElementById('fixed').style.display = 'none'  
}
  categoryLink(category):void{
    this.router.navigate([`product/:${category}`])
   this.fadaDownAll()
  }

typeLink(category, type):void{
  this.router.navigate([`product/:${category}/:${type}`])
  document.getElementById('category-menu').style.display = 'none' 
  document.getElementById('fixed').style.display = 'none' 
  
}
categoryLinkNav():void{
    this.router.navigate([`product/:Шоколад`])
    document.getElementById('type-menu').style.display = 'none'   
    document.getElementById('category-menu').style.display = 'none' 
    document.getElementById('fixed').style.display = 'none'
  }

}
