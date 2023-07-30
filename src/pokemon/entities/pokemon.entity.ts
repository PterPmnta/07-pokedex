import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Pokemon {
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    nro: number;
    //url: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
