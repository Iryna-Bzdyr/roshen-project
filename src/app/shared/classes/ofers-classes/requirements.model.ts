import { IRequirements } from './../../interfaces/ofer.interfaces/ofer-reguirements';


export class Requirements implements IRequirements{
    constructor(
    public  requirementsName: string,
    public  requirementsID: number
    ){}
}