import { IConditions } from './ofer.interfaces/ofer-working-conditions';
import { IDuties } from './ofer.interfaces/ofer-duties';
import { IRequirements } from './ofer.interfaces/ofer-reguirements';
export interface IOfer {
    oferID:number,
    position:string,
    description:string,
    contactPerson:string,
    contactRersonPhone:string,
    salary:string,
    requirements: IRequirements[],
    duties: IDuties [],
    workingСonditions: IConditions [],
    oferPhoto:string   
}
