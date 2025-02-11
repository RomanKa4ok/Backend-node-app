import { IsString } from 'class-validator';

export class IdSchema {
    @IsString()
    id: string;

    constructor(data: { id: string }) {
        this.id = data.id;
    }
}