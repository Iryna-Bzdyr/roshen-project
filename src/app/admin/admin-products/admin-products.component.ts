import { TypeService } from 'src/app/shared/services/type.service';
import { CategoryService } from './../../shared/services/category.service.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/classes/product.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { IType } from 'src/app/shared/interfaces/type.interface';


//----For Table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ThemePalette } from '@angular/material/core';



@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  productsAdmin: Array<IProduct> = [];
  categoriesAdmin: Array<ICategory>=[]
  typesAdmin: Array<IType>=[]
  productID:string
  editStatus: boolean;
  productImg: string = ''
  productIndex: number
  step:number = 0
  productDiscontPrice:number

  

  productForm = new FormGroup({
    id:  new FormControl('', [Validators.required,]),
    categoryName:  new FormControl ('',[ Validators.required]),
    typeName:  new FormControl ('',[ Validators.required]),
    name:  new FormControl('', [Validators.required, Validators.minLength(3)],),
    description:  new FormControl('', [Validators.required, Validators.minLength(10)],),
    weight:  new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')]),
    unitOfMeasurement:  new FormControl('', [Validators.required]),
    price:  new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')]),
    image: new FormControl('', [Validators.required]),
    minQuantity:  new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')]),
    amountInTheDrawer:  new FormControl('', [Validators.required, Validators.minLength(1)],),
    shelfLife:  new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')],),
    trademark: new FormControl('', [Validators.required]),
  })

  sortedData: IProduct[]
 ;

 // Upload image variables
 ref: AngularFireStorageReference;
 task: AngularFireUploadTask;
 uploadState: Observable<string>;
 uploadProgress: Observable<number>;
 downloadURL: Observable<string>;

 // For progres bar
 color: ThemePalette = 'primary';
 value = 0;

//For table 
displayedColumns: string[] = ['id', 'categoryName',  'typeName', 'name', 'newItem', 'price', 'discount', 'discountPrice',  'edit','delete'];
dataSource: MatTableDataSource<IProduct>;

  constructor(private productsService: ProductService,
              private categoryService: CategoryService, 
              private typeService: TypeService, 
              private afStorage: AngularFireStorage) {
    this.sortedData  = this.productsAdmin.slice();
   }

  ngOnInit() {
    this.getAdminProducts();
    this.getAdminCategories();
    this.step = 1
    document.getElementById('editPhoto').style.display = 'none' 
  }
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

//-------------------------------------------------------------------------------------
@ViewChild('fileUploader', {static: true}) 
fileUploader:ElementRef;

resetFileUploader() { 
  this.fileUploader.nativeElement.value = null;
  document.getElementById('alert').style.display = 'none'
  this.productForm.controls.image.setValue('')
  this.value = null
}
//--------------------------------------------------------------------------------------


filterType(): void {  
    this.typeService.getJSONTypes().subscribe(
      data => {
        this.typesAdmin = data.filter(p=> p.categoryName=== this.productForm.controls.categoryName.value); 
      },
      err => {
        console.log(err);
      }
    );
}



  private getAdminCategories(): void {
    this.categoryService.getJSONCategory().subscribe(
      data=>{
        this.categoriesAdmin = data
      },
      err => {
        console.log(err)
      }
    )
    }


  private getAdminProducts(): void {    
    this.productsService.getJSONProduct().subscribe(
      data => {
        this.productsAdmin = data;
        this.dataSource = new MatTableDataSource(this.productsAdmin);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }

  addProduct(): void {
    const newProduct: IProduct = new Product(
    this.productForm.controls.id.value,
    this.productForm.controls.categoryName.value,
    this.productForm.controls.typeName.value,
    this.productForm.controls.name.value,
    this.productForm.controls.description.value,
    this.productForm.controls.weight.value,
    this.productForm.controls.unitOfMeasurement.value,
    this.productForm.controls.price.value,
    this.productImg,
    this.productForm.controls.minQuantity.value,
    this.productForm.controls.amountInTheDrawer.value,
    this.productForm.controls.shelfLife.value,
    this.productForm.controls.trademark.value,
    );
    
    if (this.editStatus) {
    
      newProduct.id = this.productID;
      this.productsService.updateJSONProducts(newProduct).subscribe(
        () => {
          debugger
          this.getAdminProducts();
        }
      );
    } 
    else {
      this.productsService.addJSONProducts(newProduct).subscribe(
        () => {
          this.getAdminProducts();
        }
      );
    }

    this.productForm.reset()
    this.editStatus = false;
    this.step = 1
    this.setStep(1)
    document.getElementById('editPhoto').style.display = 'none'
    this.productForm.controls.image.setValidators([Validators.required])
    this.productForm.controls.image.updateValueAndValidity()
    document.getElementById('loadsection').style.display = 'block'
    this.resetFileUploader()
  }

  deleteProduct(product: IProduct): void {
    this.productsService.deleteJSONProducts(product.id).subscribe(
      () => {
        this.getAdminProducts();
      }
    );
  }

  editProduct(product: IProduct, step:number): string { 
    this.productForm.controls.id.setValue(product.id)
    this.productForm.controls.categoryName.setValue(product.categoryName)

    this.filterType()
    this.productForm.controls.typeName.setValue(product.typeName)
    this.productForm.controls.name.setValue(product.name)
    this.productForm.controls.description.setValue(product.description)
    this.productForm.controls.weight.setValue(product.weight)
    this.productForm.controls.price.setValue(product.price)
    this.productForm.controls.unitOfMeasurement.setValue(product.unitOfMeasurement)
    this.productForm.controls.minQuantity.setValue(product.minQuantity)
    this.productForm.controls.amountInTheDrawer.setValue(product.amountInTheDrawer)
    this.productForm.controls.shelfLife.setValue(product.shelfLife)
    this.productForm.controls.trademark.setValue(product.trademark)
    this.productImg = product.image
    this.productForm.controls.image.clearValidators()
    this.productForm.controls.image.updateValueAndValidity()
    this.editStatus = true;
    this.productID = product.id;
    this.setStep(step)    
    document.getElementById('loadsection').style.display = 'none'
    document.getElementById('editPhoto').style.display = 'block'
    return this.productImg
  }

  setStep(index: number) {
    this.step = index;
    console.log(index)
  }
  // Change NEW items---------------------------------------------------------------------------
  changeNEW(event: any, index:string, productCheck: { checkedNEW: boolean; }, product: IProduct) {
  
    productCheck.checkedNEW = productCheck.checkedNEW
    this.findIndex(index)
    this.productsAdmin[this.productIndex].newItem = productCheck.checkedNEW
    this.productsService.updateJSONProducts(this.productsAdmin[this.productIndex]).subscribe(
      () => {
        this.getAdminProducts();
      }
    );
  }
// Change discount------------------------------------------------------------------------
  onChange(event: any, index:string, productCheck: { checked: boolean; }, product: IProduct) {
  
  productCheck.checked = productCheck.checked
  this.findIndex(index)
  this.productsAdmin[this.productIndex].discount = productCheck.checked

    if(!this.productsAdmin[this.productIndex].discount){
    this.productsAdmin[this.productIndex].discountPrice = null
  }
  this.productDiscontPrice=null
  this.productsService.updateJSONProducts(this.productsAdmin[this.productIndex]).subscribe(
    () => {
      this.getAdminProducts();
    }
  );
} 
//Set discount price---------------------------------------------------------
onChangePrise(event:any, index:string,   product: IProduct){
  this.findIndex(index)
  this.productsService.updateJSONProducts(this.productsAdmin[this.productIndex]).subscribe(
    () => {
      this.getAdminProducts();
    }
  );
}

   findIndex(id:string) {
    this.productIndex = this.productsAdmin.findIndex(index => index.id === id)
    return this.productIndex 
  }


  //Add photo to firebase----------------------------------------------------------------------------  
  public upload(event: any): void {
   
    const file = event.target.files[0];
    const filePath = `products/${this.createUUID()}.${file.type.split('/')[1]}`;
    this.task = this.afStorage.upload(filePath, file);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
   
    
    this.task.snapshotChanges()
    .pipe(finalize(() => this.downloadURL = this.afStorage.ref(filePath).getDownloadURL()))
    .subscribe();
    this.task.then((e) => {
      this.afStorage.ref(`products/${e.metadata.name}`).getDownloadURL().subscribe(data => {
      this.productImg = data;
      return this.productImg
      
      });
    });
  }

// Delete upload photo-------------------------------------------------------------------  
 deleteEl():void{
  this.afStorage.storage.refFromURL(this.productImg).delete()
  document.getElementById('alert').innerHTML = 'File was deleted'
 }

 //Delete photo from firebase-------------------------------------------------------------- 
 deleteEditPhoto():void{
  this.afStorage.storage.refFromURL(this.productImg).delete()
  this.productForm.controls.image.setValue('')
  this.productForm.controls.image.setValidators([Validators.required])
  this.productForm.controls.image.updateValueAndValidity()
  document.getElementById('loadsection').style.display = 'block'
  document.getElementById('editPhoto').style.display = 'none'

 }
  
//Create url for download photo to firebase----------------------------------------------
  public createUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

   //------------------------------------------------------------
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 
}

