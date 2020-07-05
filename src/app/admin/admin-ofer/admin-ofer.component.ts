
import { Conditions } from './../../shared/classes/ofers-classes/conditions.model';
import { Duties } from './../../shared/classes/ofers-classes/duties.model';
import { Requirements } from './../../shared/classes/ofers-classes/requirements.model';
import { Ofer } from './../../shared/classes/ofer.model';
import { OferService } from './../../shared/services/ofer.service';
import { IOfer } from './../../shared/interfaces/ofer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, finalize } from 'rxjs/operators';
import { IDuties } from 'src/app/shared/interfaces/ofer.interfaces/ofer-duties';
import { IConditions } from 'src/app/shared/interfaces/ofer.interfaces/ofer-working-conditions';
import { IRequirements } from 'src/app/shared/interfaces/ofer.interfaces/ofer-reguirements';


@Component({
  selector: 'app-admin-ofer',
  templateUrl: './admin-ofer.component.html',
  styleUrls: ['./admin-ofer.component.scss']
})

export class AdminOferComponent implements OnInit {
  ofersAdmin: Array<IOfer> = []
  requirements:Array<IRequirements> = []
  duties:Array<IDuties> = []
  workingConditions:Array<IConditions> = []
  oferImg: string = ''
  editStatus: boolean;
  oferID:number
  requirementsID:number
  dutiesID:number
  workingConditionsID:number
  requirementsStatus:boolean = false
  dutiesStatus:boolean = false
  workingСonditionsStatus:boolean = false
  requirementsIndex:number
  dutiesIndex:number
  workingConditionsIndex:number
  
  
  oferDetails = new FormGroup({
    requirementsName: new FormControl('', [Validators.required, Validators.minLength(3)],),
    dutiesName: new FormControl('', [Validators.required, Validators.minLength(3)],),
    workingConditionsName: new FormControl('', [Validators.required, Validators.minLength(3)],),
  })

 

  oferForm = new FormGroup({
    position: new FormControl('', [Validators.required, Validators.minLength(3)],),
    description: new FormControl('', [Validators.required, Validators.minLength(3)],),
    contactPerson: new FormControl('', [Validators.required, Validators.minLength(3)],),
    contactRersonPhone: new FormControl('', [Validators.required, Validators.minLength(3)],),
    salary: new FormControl('', [Validators.required, Validators.minLength(3)],),
    oferIMG: new FormControl('', [Validators.required]),
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
displayedColumns: string[] = ['id', 'position', 'description', 'edit','delete'];
dataSource: MatTableDataSource<IOfer>;


  constructor(private afStorage: AngularFireStorage, private oferService: OferService) { }

  ngOnInit() {
    this.getAdminOfers()
    this.step = 1
    document.getElementById('editPhoto').style.display = 'none'
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  
  
//-------------------------------------------------------------------------------------
@ViewChild('fileUploader', {static: true}) 
fileUploader:ElementRef;

//-----------------------------------------
addrequirements(){
  const newRequirements : IRequirements = new Requirements(
    this.oferDetails.controls.requirementsName.value,
    1
  )
  if(this.requirements.length>0){
    newRequirements.requirementsID = this.requirements.slice(-1)[0].requirementsID + 1;
  }

  this.requirements.push(newRequirements)
  this.oferDetails.reset()
}


findRequirementsIndex(id:number) {
  this.requirementsIndex = this.requirements.findIndex(index => index.requirementsID === id)
  return this.requirementsIndex 
}

delRequirements(requirements:IRequirements){
  this.findRequirementsIndex(requirements.requirementsID)
  this.requirements.splice(this.requirementsIndex,1)
}
//------------------------------------------------------------------
addDuties(){
  const newDuties : IDuties = new Duties(
    this.oferDetails.controls.dutiesName.value,
    1
  )
  if(this.duties.length>0){
    newDuties.dutiesID = this.requirements.slice(-1)[0].requirementsID + 1;
  }

  this.duties.push(newDuties)
  this.oferDetails.reset()
}


findDutiesIndex(id:number) {
  this.dutiesIndex = this.duties.findIndex(index => index.dutiesID === id)
  return this.dutiesIndex 
}

delDuties(duties:IDuties){
  this.findDutiesIndex(duties.dutiesID)
  this.duties.splice(this.dutiesIndex,1)
}
//---------------------------------------------------------------------------

addWorkingConditions(){
  const newWorkingСonditions : IConditions = new Conditions(
    this.oferDetails.controls.workingConditionsName.value,
    1
  )
  if(this.workingConditions.length>0){
    newWorkingСonditions.conditionsID = this.workingConditions.slice(-1)[0].conditionsID + 1;
  }

  this.workingConditions.push(newWorkingСonditions)
  this.oferDetails.reset()
}


findworkingConditionsIndex(id:number) {
  this.workingConditionsIndex = this.workingConditions.findIndex(index => index.conditionsID === id)
  return this.workingConditionsIndex 
}

delWorkingConditions(workingСonditions:IConditions){
  this.findworkingConditionsIndex(workingСonditions.conditionsID)
  this.workingConditions.splice(this.workingConditionsIndex,1)
}



resetFileUploader() { 
  this.fileUploader.nativeElement.value = null;
  document.getElementById('alert').style.display = 'none'
  this.oferForm.controls.oferIMG.setValue('')
  this.value = null
}
//--------------------------------------------------------------------------------------
private getAdminOfers(): void {
  this.oferService.getJSONCOfer().subscribe(
    data => {
      this.ofersAdmin = data
      this.dataSource = new MatTableDataSource(this.ofersAdmin);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    err => {
      console.log(err)
    }
  )
}





//Add ofer ------------------------------------------------------------------------
addOfer(): void {
  const newOfer: IOfer= new Ofer(
    1,
    this.oferForm.controls.position.value,
    this.oferForm.controls.description.value,
    this.oferForm.controls.contactPerson.value,
    this.oferForm.controls.contactRersonPhone.value,
    this.oferForm.controls.salary.value,
    this.requirements,
    this.duties,
    this.workingConditions,
    this.oferImg
  )
  if (this.ofersAdmin.length > 0) {
    newOfer.oferID = this.ofersAdmin.slice(-1)[0].oferID + 1;
  }

  if (this.editStatus) {  
    newOfer.oferID = this.oferID;
    this.oferService.updateJSONOfer(newOfer).subscribe(
      () => {
        this.getAdminOfers();
      }
    );
  }

else{
  this.oferService.addJSONPOfer(newOfer).subscribe(
    () => {
      this.getAdminOfers();
    } 
  )
}
this.editStatus = false;
this.requirements = []
this.duties = []
this.workingConditions = []
  document.getElementById('editPhoto').style.display = 'none'
  this.step = 1
  this.setStep(1)
  this.oferForm.reset()
  this.oferForm.controls.oferIMG.setValidators([Validators.required])
  this.oferForm.controls.oferIMG.updateValueAndValidity()
  document.getElementById('loadsection').style.display = 'block'
  this.resetFileUploader()
}
//---------------------------------------------------------------------------------  

//Edit category------------------------------------------------------------------------
editOfer(ofer: IOfer, step:number): string { 
  this.oferForm.controls.position.setValue(ofer.position)
  this.oferForm.controls.description.setValue(ofer.description)
  this.oferForm.controls.salary.setValue(ofer.salary)
  this.oferForm.controls.contactPerson.setValue(ofer.contactPerson)
  this.oferForm.controls.contactRersonPhone.setValue(ofer.contactRersonPhone)
  this.oferForm.controls.oferIMG.clearValidators()
  this.oferForm.controls.oferIMG.updateValueAndValidity()
  this.requirements = ofer.requirements
  this.duties = ofer.duties
  this.workingConditions = ofer.workingСonditions
  this.oferID = ofer.oferID
  this.oferImg = ofer.oferPhoto
  this.editStatus = true
  this.setStep(step)
  document.getElementById('loadsection').style.display = 'none'
  document.getElementById('editPhoto').style.display = 'block'
  return this.oferImg
}
//Delete category------------------------------------------------------------------------

deleteOfer(ofer: IOfer): void {
  this.oferImg = ofer.oferPhoto
  this.afStorage.storage.refFromURL(this.oferImg).delete()
  this.oferService.deleteJSONOfer(ofer.oferID).subscribe(
    () => {
      this.getAdminOfers();
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
  const filePath = `ofers/${this.createUUID()}.${file.type.split('/')[1]}`;
  this.task = this.afStorage.upload(filePath, file);
  this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  this.uploadProgress = this.task.percentageChanges();
 
  
  this.task.snapshotChanges()
  .pipe(finalize(() => this.downloadURL = this.afStorage.ref(filePath).getDownloadURL()))
  .subscribe();
  this.task.then((e) => {
    this.afStorage.ref(`ofers/${e.metadata.name}`).getDownloadURL().subscribe(data => {
    this.oferImg = data;
    return  this.oferImg    
    });
  });
}

// Delete upload photo-------------------------------------------------------------------
deleteEl():void{
this.afStorage.storage.refFromURL(this.oferImg).delete()
document.getElementById('alert').innerHTML = 'File was deleted'
this.resetFileUploader()

}


//Delete photo from firebase-------------------------------------------------------------- 
deleteEditPhoto():void{
  this.afStorage.storage.refFromURL(this.oferImg).delete()
  this.oferForm.controls.oferIMG.setValue('')
  this.oferForm.controls.oferIMG.setValidators([Validators.required])
  this.oferForm.controls.oferIMG.updateValueAndValidity()
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
