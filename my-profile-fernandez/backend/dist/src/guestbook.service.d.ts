import { ConfigService } from '@nestjs/config';
export declare class GuestbookService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    findAll(): Promise<any[]>;
    create(dto: any): Promise<any[]>;
    update(id: string, dto: any): Promise<any[]>;
    delete(id: string): Promise<any[]>;
}
