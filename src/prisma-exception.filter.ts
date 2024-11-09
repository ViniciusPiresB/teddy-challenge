import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionCodesForErrorsAndStatus = {
      P2003: {
        errorMessage: "Some fields don't exist in database",
        statusCode: HttpStatus.CONFLICT,
      },
      P2002: {
        errorMessage: 'Some unique fields already exist on database',
        statusCode: HttpStatus.CONFLICT,
      },
      P2025: {
        errorMessage: 'No records with specific constraint were found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    };

    const code = exception.code;
    const exceptionCodeAndMessage = exceptionCodesForErrorsAndStatus[code];

    if (!exceptionCodeAndMessage) {
      super.catch(exception, host);
      return;
    }

    const errorMessage = exceptionCodesForErrorsAndStatus[code].errorMessage;
    const statusCode = exceptionCodesForErrorsAndStatus[code].statusCode;

    response
      .status(statusCode)
      .send({ statusCode: statusCode, message: errorMessage });
  }
}
