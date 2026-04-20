import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const mapped = mapPrismaException(exception);

    response.status(mapped.status).json({
      statusCode: mapped.status,
      message: mapped.message,
      error: mapped.error,
    });
  }
}

function mapPrismaException(exception: Prisma.PrismaClientKnownRequestError) {
  switch (exception.code) {
    case 'P2002': {
      const target = Array.isArray(exception.meta?.target)
        ? exception.meta.target.join(', ')
        : 'field';
      const error = new ConflictException(
        `A record with the same ${target} already exists.`,
      );

      return {
        status: error.getStatus(),
        message: error.message,
        error: error.name,
      };
    }
    case 'P2003': {
      const fieldName = String(exception.meta?.field_name ?? '');
      const relationLabel = humanizeRelationField(fieldName);

      return {
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid ${relationLabel} selected.`,
        error: 'Bad Request',
      };
    }
    case 'P2025': {
      const error = new NotFoundException('The requested record no longer exists.');

      return {
        status: error.getStatus(),
        message: error.message,
        error: error.name,
      };
    }
    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
      };
  }
}

function humanizeRelationField(fieldName: string) {
  const normalized = fieldName.toLowerCase();

  if (normalized.includes('department')) {
    return 'department';
  }

  if (normalized.includes('faculty')) {
    return 'faculty';
  }

  if (normalized.includes('principalinvestigator')) {
    return 'principal investigator';
  }

  if (normalized.includes('leadresearcher')) {
    return 'lead researcher';
  }

  if (normalized.includes('supervisor')) {
    return 'supervisor';
  }

  if (normalized.includes('cosupervisor')) {
    return 'co-supervisor';
  }

  if (normalized.includes('group')) {
    return 'group';
  }

  if (normalized.includes('researcharea')) {
    return 'research area';
  }

  return 'related record';
}
