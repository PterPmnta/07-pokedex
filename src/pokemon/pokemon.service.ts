import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
    ) {}

    async create(createPokemonDto: CreatePokemonDto) {
        try {
            createPokemonDto.name = createPokemonDto.name.toLowerCase();
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return {
                data: pokemon,
                message: 'Pokemon created successfully',
            };
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    findAll() {
        return `This action returns all pokemon`;
    }

    async findOne(term: string) {
        try {
            let pokemon: Pokemon;
            let condition: object = { name: term.toLowerCase().trim() };

            if (!isNaN(+term)) condition = { nro: term };
            if (isValidObjectId(term)) condition = { _id: term };

            console.log(condition);

            pokemon = await this.pokemonModel.findOne(condition);

            if (!pokemon) {
                throw new NotFoundException(
                    `Pokemon with id ${term} not found`,
                );
            }

            return pokemon;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        try {
            await this.findOne(term);

            if (updatePokemonDto.name) {
                updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
            }

            const pokemonUpdated = this.pokemonModel.findOneAndUpdate(
                {
                    $or: [
                        { nro: !isNaN(+term) ? +term : undefined },
                        { _id: isValidObjectId(term) ? term : undefined },
                        { name: term },
                    ],
                },
                { $set: updatePokemonDto },
                { new: true },
            );

            return pokemonUpdated;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    remove(id: number) {
        return `This action removes a #${id} pokemon`;
    }

    private handleExceptions(error: any) {
        if (error.code === 11000) {
            throw new BadRequestException(
                `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
            );
        }
        throw new InternalServerErrorException(
            `Can't create pokemon - check server logs`,
        );
    }
}
