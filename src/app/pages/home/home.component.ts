
import { AosToken } from '../../aos';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Array<ICategory> = []
  count:number
  num: number


  constructor(private categoryService: CategoryService,
    private router: Router,
    @Inject(AosToken) aos) {
    aos.init();
  }

  ngOnInit() {

    this.getCategories()
   
    
  }
  private getCategories(): void {
    this.categoryService.getJSONCategory().subscribe(
      data => {

        this.categories = data
        console.log(this.categories)
      },
      err => {
        console.log(err)
      }
    )
  }
  categoryLink():void{
    this.router.navigate([`product/:Шоколад`])
  }
  changeScaleOnmouseOver(i):void{
    document.querySelectorAll('.category')[i].classList.remove('category-mouse-leave')
    document.querySelectorAll('.category')[i].classList.add('category-mouse-over')
  
  }
  
  changeScaleOnmouseLaeve(i):void{
    document.querySelectorAll('.category')[i].classList.remove('category-mouse-over')
    document.querySelectorAll('.category')[i].classList.add('category-mouse-leave')
    
  }
  categoryLinkGroup(category):void{
    this.router.navigate([`product/:${category}`])
  }
}


