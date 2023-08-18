import { Pokemon } from './../pokemon/entities/pokemon.entity';
import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
    ) {}

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

        data.results.forEach(async ({ name, url }) => {
            const segments = url.split('/');
            const nro: number = +segments[segments.length - 2];

            await this.pokemonModel.create({ name, nro });
        });

        return 'Seed executed';
    }
}
