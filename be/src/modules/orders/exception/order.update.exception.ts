import { BadRequestException } from "@nestjs/common";

export class OrderUpdateException extends BadRequestException
{
    constructor() {
        super('There was an error in your order, please try again');
    }
}