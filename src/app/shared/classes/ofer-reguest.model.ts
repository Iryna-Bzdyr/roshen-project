import { IOferRequests } from '../interfaces/ofer-requesr';

export class OferRequests implements IOferRequests {
    constructor (
    public    requestID: number,
    public    userName:string,
    public    userPhone:string,
    public    userEmail:string,
    public    position:string,
    public    reguestDate:object,
    public    sv?:string  
    ){}
}


