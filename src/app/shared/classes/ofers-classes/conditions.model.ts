import { IConditions } from './../../interfaces/ofer.interfaces/ofer-working-conditions';
export class Conditions implements IConditions{
    constructor(
    public    conditionsName:string,
    public    conditionsID:number 
    ){}
}