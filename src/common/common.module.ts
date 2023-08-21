import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { FetchAdapter } from './adapters/fetch.adapter';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [AxiosAdapter, FetchAdapter],
    exports: [AxiosAdapter, FetchAdapter],
})
export class CommonModule {}
