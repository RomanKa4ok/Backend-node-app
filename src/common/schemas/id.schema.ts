import { IsString } from 'class-validator';

export class IdSchema {
    @IsString()
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}