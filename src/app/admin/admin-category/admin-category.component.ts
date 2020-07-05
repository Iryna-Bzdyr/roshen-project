import { CategoryService } from './../../shared/services/category.service.service';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Category } from 'src/app/shared/classes/category.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
//----For Table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  categoriesAdmin: Array<ICategory> = []
  categoryImg: string = ''
  // category: ICategory
  editStatus: boolean;
  categoryID:number


  categoryForm = new FormGroup({
    categoryName: new FormControl('', [Validators.required, Validators.minLength(3)],),
    categoryIMG: new FormControl('', [Validators.required]),
  })

step:number = 0

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
  displayedColumns: string[] = ['id', 'categoryName', 'edit','delete'];
  dataSource: MatTableDataSource<ICategory>;

//-----------------------------------------------------------------------

  constructor(private categoryService: CategoryService, private afStorage: AngularFireStorage) {   
   }

  ngOnInit() {
    this.getAdminCategories()
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
    this.categoryForm.controls.categoryIMG.setValue('')
    this.value = null
  }
 //--------------------------------------------------------------------------------------
  private getAdminCategories(): void {
    this.categoryService.getJSONCategory().subscribe(
      data => {
        this.categoriesAdmin = data
        this.dataSource = new MatTableDataSource(this.categoriesAdmin);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.categoriesAdmin)
      },
      err => {
        console.log(err)
      }
    )
  }
//Add category ------------------------------------------------------------------------
  addCategory(): void {
    const newCategory: ICategory = new Category(
      1,
      this.categoryForm.controls.categoryName.value,
      this.categoryImg
    )
    if (this.categoriesAdmin.length > 0) {
      newCategory.categoryID = this.categoriesAdmin.slice(-1)[0].categoryID + 1;
    }

    if (this.editStatus) {  
      newCategory.categoryID = this.categoryID;
      this.categoryService.updateJSONCategory(newCategory).subscribe(
        () => {
          this.getAdminCategories();
        }
      );
    }

  else{
    this.categoryService.addJSONPCategory(newCategory).subscribe(
      () => {
        this.getAdminCategories();
      } 
    )
  }
  this.editStatus = false;
    document.getElementById('editPhoto').style.display = 'none'
    this.step = 1
    this.setStep(1)
    this.categoryForm.reset()
    this.categoryForm.controls.categoryIMG.setValidators([Validators.required])
    this.categoryForm.controls.categoryIMG.updateValueAndValidity()
    document.getElementById('loadsection').style.display = 'block'
    this.resetFileUploader()
  }
//---------------------------------------------------------------------------------   
 

//Edit category------------------------------------------------------------------------
  editCategory(category: ICategory, step:number): string { 
    this.categoryForm.controls.categoryName.setValue(category.categoryName)
    this.categoryForm.controls.categoryIMG.clearValidators()
    this.categoryForm.controls.categoryIMG.updateValueAndValidity()
    this.categoryID = category.categoryID
    this.categoryImg = category.categoryImg
    this.editStatus = true
    this.setStep(step)
    document.getElementById('loadsection').style.display = 'none'
    document.getElementById('editPhoto').style.display = 'block'
    return this.categoryImg
  }
//Delete category------------------------------------------------------------------------

  deleteCategory(category: ICategory): void {
    this.categoryImg = category.categoryImg
    this.afStorage.storage.refFromURL(this.categoryImg).delete()
    this.categoryService.deleteJSONCategory(category.categoryID).subscribe(
      () => {
        this.getAdminCategories();
      }
    );
  }

//For explenation panel---------------------------------------------------------------------------------------  
setStep(index: number) {
    this.step = index;
  }
//Add photo to firebase----------------------------------------------------------------------------  
  public upload(event: any): void { 
     
    const file = event.target.files[0];
    const filePath = `category/${this.createUUID()}.${file.type.split('/')[1]}`;
    this.task = this.afStorage.upload(filePath, file);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
   
    
    this.task.snapshotChanges()
    .pipe(finalize(() => this.downloadURL = this.afStorage.ref(filePath).getDownloadURL()))
    .subscribe();
    this.task.then((e) => {
      this.afStorage.ref(`category/${e.metadata.name}`).getDownloadURL().subscribe(data => {
      this.categoryImg = data;
      return  this.categoryImg    
      });
    });
  }

// Delete upload photo-------------------------------------------------------------------
 deleteEl():void{
  this.afStorage.storage.refFromURL(this.categoryImg).delete()
  document.getElementById('alert').innerHTML = 'File was deleted'
  this.resetFileUploader()
  
 }

//Delete photo from firebase-------------------------------------------------------------- 
 deleteEditPhoto():void{
  this.afStorage.storage.refFromURL(this.categoryImg).delete()
  this.categoryForm.controls.categoryIMG.setValue('')
  this.categoryForm.controls.categoryIMG.setValidators([Validators.required])
  this.categoryForm.controls.categoryIMG.updateValueAndValidity()
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
