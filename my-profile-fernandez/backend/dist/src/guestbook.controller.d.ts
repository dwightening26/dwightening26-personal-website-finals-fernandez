import { GuestbookService } from './guestbook.service';
export declare class GuestbookController {
    private readonly service;
    constructor(service: GuestbookService);
    getHello(): {
        message: string;
    };
    getAll(): Promise<any[]>;
    create(dto: any): Promise<any[]>;
    update(id: string, dto: any): Promise<any[]>;
    remove(id: string): Promise<any[]>;
}
