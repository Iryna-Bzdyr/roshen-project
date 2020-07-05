import { IPager } from './../interfaces/pager.intefrace';

export class Pager implements IPager{
    constructor(
    public start:number,
    public end:number
    ){}
}