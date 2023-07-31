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

    findAll() {
        return `This action returns all pokemon`;
    }

    async findOne(term: string) {
        try {
            let pokemon: Pokemon;
            let condition: object = { name: term.toLowerCase().trim() };

            if (!isNaN(+term)) condition = { nro: term };
            if (isValidObjectId(term)) condition = { _id: term };

            if (!pokemon) {
                throw new NotFoundException(
                    `Pokemon with id ${term} not found`,
                );
            }

            pokemon = await this.pokemonModel.findOne(condition);
            return pokemon;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    update(id: number, updatePokemonDto: UpdatePokemonDto) {
        return `This action updates a #${id} pokemon`;
    }

    remove(id: number) {
        return `This action removes a #${id} pokemon`;
    }
}
