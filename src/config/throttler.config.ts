import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerAsyncOptions } from '@nestjs/throttler'

export const throttlerConfig: ThrottlerAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
    }),
}
