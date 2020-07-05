import { IDuties } from './../../interfaces/ofer.interfaces/ofer-duties';


export class Duties implements IDuties{
    constructor(
    public dutiesName:string,
    public dutiesID:number
    ){}
}