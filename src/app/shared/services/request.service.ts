import { IRequests } from './../interfaces/requests';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  requests:Array<IRequests> = []
  private url: string
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/requests'
   }
   getRequests(): Array<IRequests> {
     return this.requests
   }
   getJSONRequests(): Observable<Array<IRequests>>{
     return this.http.get<Array<IRequests>>(this.url)
   }
   addJSONRequest(request:IRequests):Observable<Array<IRequests>>{
     return this.http.post<Array<IRequests>>(this.url,request)
   }
   deleteJSONReguest(id:number):Observable<Array<IRequests>>{
     return this.http.delete<Array<IRequests>>(`${this.url}/${id}`)
   }
}
