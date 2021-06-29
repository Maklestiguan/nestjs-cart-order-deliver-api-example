import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces'

export const eventEmitterConfig: EventEmitterModuleOptions = {
    wildcard: false,
    delimiter: '.',
    newListener: true,
    removeListener: true,
    maxListeners: 10,
    verboseMemoryLeak: false,
    ignoreErrors: false,
}
