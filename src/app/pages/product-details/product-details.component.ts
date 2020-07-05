import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  view: IProduct;
 
  constructor(private prs: ProductService, private route: ActivatedRoute) { }


  ngOnInit() {
    console.log(this.route.snapshot.paramMap.keys)
    // this.getMyProduct();
  }

  // getMyProduct(): void {
  //   const id = +this.route.snapshot.paramMap.get('id')
  //   this.prs.getJSONOneProduct(id).subscribe(
  //     data => {
  //       this.view = data
  //     }
  //   )
  // }
}
