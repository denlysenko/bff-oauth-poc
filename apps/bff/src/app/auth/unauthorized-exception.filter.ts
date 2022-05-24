import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AUTH_COOKIE } from './constants';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response
      .cookie(AUTH_COOKIE, '', {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date('1970-01-01'),
        // secure: true
      })
      .status(status)
      .json({
        statusCode: status,
        message: exception.message,
      });
  }
}
