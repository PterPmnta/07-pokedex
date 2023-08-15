import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface PokeapiResponse {
    count: number;
    next: string;
    previous: null;
    results: Result[];
}

export interface Result {
    name: string;
    url: string;
}

@Injectable()
export class SeedService {
    constructor(private readonly httpService: HttpService) {}

    async executeSeed() {
        const { data } = await firstValueFrom(
            this.httpService
                .get<PokeapiResponse>(
                    'https://pokeapi.co/api/v2/pokemon?limit=10',
                )
                .pipe(
                    catchError((error: AxiosError) => {
                        console.error(error.response.data);
                        throw error.response.data;
                    }),
                ),
        );

        data.results.forEach(({ name, url }) => {
            const segments = url.split('/');
            const nro: number = +segments[segments.length - 2];
        });

        return data.results;
    }
}
