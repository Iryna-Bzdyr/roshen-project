import { Type } from './../../shared/classes/type.model';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IType } from './../../shared/interfaces/type.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TypeService } from 'src/app/shared/services/type.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-type',
  templateUrl: './admin-type.component.html',
  styleUrls: ['./admin-type.component.scss']
})
export class AdminTypeComponent implements OnInit {
typesAdmin: Array<IType> = []
categoriesAdmin: Array<ICategory>=[]
typeID: number
editStatus: boolean;

typesForm = new FormGroup({
  typesCategory: new FormControl('', [Validators.required, Validators.minLength(3)]),
  typesName: new FormControl('', [Validators.required, Validators.minLength(3)])
})

step:number = 0

//For table 
displayedColumns: string[] = ['id', 'categoryName', 'typeName', 'edit','delete'];
dataSource: MatTableDataSource<IType>;

  constructor(private typeService: TypeService,  private categoryService: CategoryService) { }

  ngOnInit() {
    this.getAdminTypes()
    this.getAdminCategories()
    this.step = 1
  }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort; 
   
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

  private getAdminTypes():void{
    this.typeService.getJSONTypes().subscribe(
      data => {
        this.typesAdmin = data
        this.dataSource = new MatTableDataSource(this.typesAdmin);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err)
      }
    )
  }
 
  addType():void{
    const newType: IType = new Type(
      this.typesForm.controls.typesCategory.value,
      this.typesForm.controls.typesName.value,
      1
    )
    if (this.typesAdmin.length > 0) {
      newType.typeID = this.typesAdmin.slice(-1)[0].typeID + 1;
    }
    if (this.editStatus){
      newType.typeID = this.typeID
      this.typeService.updateJSONType(newType).subscribe(
        () =>{
          this.getAdminTypes()
        }
      )
    }
    else{
      this.typeService.addJSONType(newType).subscribe(
        ()=>{
          this.getAdminTypes()
        }
      )
    }
    this.editStatus = false;
    this.step = 1
    this.setStep(1)
    this.typesForm.reset()
  }
  
  editType(type:IType, step:number):void{
    this.typesForm.controls.typesCategory.setValue(type.categoryName)
    this.typesForm.controls.typesName.setValue(type.typeName)
    this.typeID = type.typeID
    this.editStatus = true
    this.setStep(step)
  }

deleteType(type:IType):void{
  this.typeService.deleteJSONType(type.typeID).subscribe(
    ()=>{
      this.getAdminTypes()
    }
  )
}

  setStep(index: number) {
    this.step = index;
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
