import { Injectable } from '@nestjs/common';
import { IHttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class FetchAdapter implements IHttpAdapter {
    async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('This is an error - check logs');
        }
    }
}
