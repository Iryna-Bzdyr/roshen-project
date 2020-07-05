import { IRequests } from './../interfaces/requests';

export class UserRequest implements IRequests { 
  constructor (
  public  requestID: number,
  public  userName:string,
  public  userPhone:string,
  public  userEmail:string,
  public  requestDescription:string,
  public  reguestDate:object
  ){}
}
