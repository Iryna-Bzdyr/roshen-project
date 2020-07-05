import { Observable } from 'rxjs';
import { IOfer } from './../interfaces/ofer';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OferService {
  ofers: Array<IOfer> = []
  private url: string
   constructor(private http:HttpClient) {
     this.url = 'http://localhost:3000/ofer'
    }
    getOfer(): Array<IOfer> {
     return this.ofers
   }
   getJSONCOfer(): Observable<Array<IOfer>>{
     return this.http.get<Array<IOfer>>(this.url)
   }
   addJSONPOfer(ofer:IOfer): Observable<Array<IOfer>>{
     return this.http.post<Array<IOfer>>(this.url, ofer)
   }
   deleteJSONOfer(id: number): Observable<Array<IOfer>>{
     return this.http.delete<Array<IOfer>>(`${this.url}/${id}`)
   }
   updateJSONOfer(ofer:IOfer): Observable<Array<IOfer>>{
     return this.http.put<Array<IOfer>>(`${this.url}/${ofer.oferID}`, ofer)
   }
  
}
