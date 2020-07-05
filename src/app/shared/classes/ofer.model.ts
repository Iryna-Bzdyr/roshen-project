import { IDuties } from './../interfaces/ofer.interfaces/ofer-duties';
import { IRequirements } from './../interfaces/ofer.interfaces/ofer-reguirements';
import { IOfer } from './../interfaces/ofer';
import { IConditions } from '../interfaces/ofer.interfaces/ofer-working-conditions';


export class Ofer implements IOfer{
    constructor (
    public   oferID:number,
    public   position:string,
    public   description:string,
    public   contactPerson:string,
    public   contactRersonPhone:string,
    public   salary:string,
    public   requirements: IRequirements [],
    public   duties: IDuties [],
    public   workingСonditions: IConditions [],
    public   oferPhoto:string   
    ) {}
}




 