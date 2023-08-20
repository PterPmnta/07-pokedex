import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { Pokemon } from './../pokemon/entities/pokemon.entity';
import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchAdapter } from '../common/adapters/fetch.adapter';

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
        private readonly axiosAdapter: AxiosAdapter,
        private readonly fetchAdapter: FetchAdapter,
    ) {}

    async executeSeed() {
        try {
            await this.pokemonModel.deleteMany({});

            const data = await this.axiosAdapter.get<PokeapiResponse>(
                'https://pokeapi.co/api/v2/pokemon?limit=650',
            );

            const pokemonToInsert: { name: string; nro: number }[] = [];

            data.results.forEach(({ name, url }) => {
                const segments = url.split('/');
                const nro: number = +segments[segments.length - 2];

                pokemonToInsert.push({ name, nro });
            });

            await this.pokemonModel.insertMany(pokemonToInsert);

            return 'Seed executed';
        } catch (error) {
            throw new Error('This is an error - check logs');
        }
    }
}
