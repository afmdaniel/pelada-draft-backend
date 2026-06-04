import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../../../core/domain/errors/app-error';
import { InfrastructureError } from '../../../core/domain/errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message: string | string[] = 'Ocorreu um erro interno no servidor.';

    if (exception instanceof AppError) {
      status = exception.statusCode;
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<
        string,
        unknown
      >;

      code =
        typeof exceptionResponse?.error === 'string'
          ? exceptionResponse.error.toUpperCase().replace(/\s+/g, '_')
          : 'HTTP_EXCEPTION';

      message =
        (exceptionResponse?.message as string | string[]) || exception.message;
    } else if (exception instanceof InfrastructureError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = exception.code;
      message =
        'Ocorreu um erro crítico no sistema. A equipe já foi notificada.';

      this.logger.error(`[InfraError] ${exception.message}`, exception.stack);
    } else {
      this.logger.error(
        `[UnhandledError] ${(exception as Error).message}`,
        (exception as Error).stack,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
