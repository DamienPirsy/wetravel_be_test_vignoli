import { BadRequestException } from "@nestjs/common";

export class OrderCreateException extends BadRequestException
{
    constructor() {
        super('Error creating order, please try again');
    }
}