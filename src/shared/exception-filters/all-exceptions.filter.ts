import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { Request } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly _logger = new Logger(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest<Request>()

        this._logger.error({
            exception,
            host: request.hostname,
            headers: request.rawHeaders,
        })

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}
