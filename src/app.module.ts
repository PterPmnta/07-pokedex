import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: `${__dirname}/../public`,
        }),
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-pokemon'),
        PokemonModule,
    ],
})
export class AppModule {}
