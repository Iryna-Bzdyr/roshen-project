import { UserRequest } from './../../../shared/classes/request.module';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IRequests } from 'src/app/shared/interfaces/requests';
import { FormBuilder } from '@angular/forms';
import { RequestService } from 'src/app/shared/services/request.service';

// {UserRequest}

@Component({
  selector: 'app-requests-block',
  templateUrl: './requests-block.component.html',
  styleUrls: ['./requests-block.component.scss']
})
export class RequestsBlockComponent implements OnInit {
  requests: Array<IRequests> = []
  reguesrID: number
  requestDate: object

  requestForm = this.fb.group(
    {
      userName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      userPhone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      userDescription: new FormControl('', [Validators.required, Validators.minLength(2)])
    }
  )


  constructor(private fb: FormBuilder, private requestService: RequestService) { }

  ngOnInit() {
    this.getRequests()
    // console.log(Date())
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
    this.requestService.getJSONRequests().subscribe(
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
      // this.requestDate = Date.now()
      const newRequest: IRequests = new UserRequest(
        1,
        this.requestForm.get('userName').value,
        this.requestForm.get('userPhone').value,
        this.requestForm.get('email').value,
        this.requestForm.get('userDescription').value,
        this.requestDate = new Date()

      )


      if (this.requests.length > 0) {
        newRequest.requestID = this.requests.slice(-1)[0].requestID + 1;
      }
      this.requestService.addJSONRequest(newRequest).subscribe(
        () => {
          this.getRequests()
        }
      )
     
     
     

    }

  }


}

