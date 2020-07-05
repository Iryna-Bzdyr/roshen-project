import { Observable } from 'rxjs';

import { OferRequests } from './../../shared/classes/ofer-reguest.model';
import { IOferRequests } from './../../shared/interfaces/ofer-requesr';
import { Component, OnInit, Inject, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { IOfer } from 'src/app/shared/interfaces/ofer';
import { OferService } from 'src/app/shared/services/ofer.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AosToken } from 'src/app/aos';
import { IRequirements } from 'src/app/shared/interfaces/ofer.interfaces/ofer-reguirements';
import { IDuties } from 'src/app/shared/interfaces/ofer.interfaces/ofer-duties';
import { IConditions } from 'src/app/shared/interfaces/ofer.interfaces/ofer-working-conditions';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { OferRequestService } from 'src/app/shared/services/ofer-request.service';


@Component({
  selector: 'app-ofers',
  templateUrl: './ofers.component.html',
  styleUrls: ['./ofers.component.scss']
})
export class OfersComponent implements OnInit {
  ofers: Array<IOfer> = []
  oferIndex:number
  position:string
  description:string
  contactPerson:string
  contactRersonPhone:string
  salary:string
  requirements: IRequirements []
  duties: IDuties []
  workingConditions: IConditions []

  requests: Array<IOferRequests> = []
  reguesrID: number
  requestDate: object

  // Upload image variables
 ref: AngularFireStorageReference;
 task: AngularFireUploadTask;
 uploadState: Observable<string>;
 uploadProgress: Observable<number>;
 downloadURL: Observable<string>;
 
 svFile:string

  requestForm = this.fb.group(
    {
      userName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      userPhone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      sv: new FormControl('', [Validators.required]),
    }
  )

  modalRef: BsModalRef;
  constructor(private oferService: OferService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private requestService: OferRequestService,
    private afStorage: AngularFireStorage,
    @Inject(AosToken) aos
    ) {
      aos.init();
     }

  ngOnInit() {
    this.getOfers()
  }
  openSecondModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'second'});
    document.getElementById('sv-block').style.display = 'block'
    document.getElementById('message-block').style.display = 'none'
  }

  @ViewChild('fileUploader', {static: true}) 
  fileUploader:ElementRef;

  resetFileUploader() { 
    this.fileUploader.nativeElement.value = null;
    document.getElementById('alert').style.display = 'none'
    this.requestForm.controls.sv.setValue('')
   
  }




  openModal(template: TemplateRef<any>, id:number)  {
    this.modalRef = this.modalService.show(template, {class: 'modal-window modal-lg'});
    this.findIndex(id)
    this.position = this.ofers[this.oferIndex].position
    this.description = this.ofers[this.oferIndex].description
    this.contactPerson = this.ofers[this.oferIndex].contactPerson
    this.contactRersonPhone = this.ofers[this.oferIndex].contactRersonPhone
    this.salary = this.ofers[this.oferIndex].salary
    this.requirements = this.ofers[this.oferIndex].requirements
    this.duties = this.ofers[this.oferIndex].duties
    this.workingConditions = this.ofers[this.oferIndex].workingСonditions
  }



  findIndex(id:number) {
    this.oferIndex = this.ofers.findIndex(index => index.oferID === id)
    return this.oferIndex 
  }

  private getOfers(): void {
    this.oferService.getJSONCOfer().subscribe(
      data => {
        this.ofers = data
      },
      err => {
        console.log(err)
      }
    )
  }

  getErrorMessage(inputName: string) {

    return this.requestForm.get(`${inputName}`).hasError('required') ? 'Поле не може бути пустим' :
      this.requestForm.get(`${inputName}`).hasError('email') ? 'Введіть правильний email' :
        '';
  }

  public onSubmit(event): void {
  if (this.requestForm.valid){
    event.currentTarget.reset()
    this.requestForm.reset()
  }   
  }

  private getRequests(): void {
    this.requestService.getJSONOferRequests().subscribe(
      data => {
        this.requests = data

      },
      err => {
        console.log(err)
      }
    )
  }


  addRequest(): void {

    if (this.requestForm.valid) {
     
      const newOferRequest: IOferRequests = new OferRequests(
        1,
        this.requestForm.get('userName').value,
        this.requestForm.get('userPhone').value,
        this.requestForm.get('email').value,
        this.position,
        this.requestDate = new Date(),
        this.svFile
      )


      if (this.requests.length > 0) {
        newOferRequest.requestID = this.requests.slice(-1)[0].requestID + 1;
      }
      this.requestService.addJSONOferRequest(newOferRequest).subscribe(
        () => {
          this.getRequests()
        }
      )

    }
    document.getElementById('sv-block').style.display = 'none'
    document.getElementById('message-block').style.display = 'block'
  }

//Add photo to firebase----------------------------------------------------------------------------  
public upload(event: any): void { 
     
  const file = event.target.files[0];
  const filePath = `sv/${this.createUUID()}.${file.type.split('/')[1]}`;
  this.task = this.afStorage.upload(filePath, file);
  this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  this.uploadProgress = this.task.percentageChanges();
 
  
  this.task.snapshotChanges()
  .pipe(finalize(() => this.downloadURL = this.afStorage.ref(filePath).getDownloadURL()))
  .subscribe();
  this.task.then((e) => {
    this.afStorage.ref(`sv/${e.metadata.name}`).getDownloadURL().subscribe(data => {
    this.svFile = data;
    return  this.svFile    
    });
  });
}

// Delete upload photo-------------------------------------------------------------------
deleteEl():void{
this.afStorage.storage.refFromURL(this.svFile).delete()
document.getElementById('alert').innerHTML = 'File was deleted'
this.resetFileUploader()

}

//Delete photo from firebase-------------------------------------------------------------- 
deleteEditPhoto():void{
this.afStorage.storage.refFromURL(this.svFile).delete()
this.requestForm.controls.sv.setValue('')
this.requestForm.controls.sv.setValidators([Validators.required])
this.requestForm.controls.sv.updateValueAndValidity()
document.getElementById('loadsection').style.display = 'block'


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




}
