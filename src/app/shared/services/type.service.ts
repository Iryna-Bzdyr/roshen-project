import { Injectable } from '@angular/core';
import { IType } from '../interfaces/type.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
 types: Array<IType> = []
 private url: string
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/types'
   }
 getTypes(): Array<IType>{
   return  this.types
 }  
getJSONTypes(): Observable<Array<IType>> {
  return this.http.get<Array<IType>>(this.url)
} 
addJSONType(type:IType):Observable<Array<IType>>{
  return this.http.post<Array<IType>>(this.url, type)
} 
deleteJSONType(id:number):Observable<Array<IType>>{
  return this.http.delete<Array<IType>>(`${this.url}/${id}`)
}
updateJSONType(type:IType): Observable<Array<IType>>{
  return this.http.put<Array<IType>>(`${this.url}/${type.typeID}`, type)
}
}
