import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config/config'
import { throttlerConfig } from './config/throttler.config'
import { typeormConfig } from './config/typeorm.config'
import { StoresModule } from './stores/stores.module'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeormConfig),
        ThrottlerModule.forRootAsync(throttlerConfig),
        StoresModule,
    ],
})
export class AppModule {}
