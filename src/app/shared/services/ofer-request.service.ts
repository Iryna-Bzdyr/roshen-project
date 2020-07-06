import { IOferRequests } from './../interfaces/ofer-requesr';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OferRequestService {
  oferRequest:Array<IOferRequests> = []
  private url: string
  constructor(private http: HttpClient) {
    this.url = 'https://my-roshen-project.herokuapp.com/oferRequest'
   }
   getOferRequests(): Array<IOferRequests> {
     return this.oferRequest
   }
   getJSONOferRequests(): Observable<Array<IOferRequests>>{
     return this.http.get<Array<IOferRequests>>(this.url)
   }
   addJSONOferRequest(request:IOferRequests):Observable<Array<IOferRequests>>{
     return this.http.post<Array<IOferRequests>>(this.url,request)
   }
   deleteJSONOferReguest(id:number):Observable<Array<IOferRequests>>{
     return this.http.delete<Array<IOferRequests>>(`${this.url}/${id}`)
   }
}
