import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  BadResponse,
  SuccessResponse,
  PaginationData,
  PaginationResponse,
} from '../dto/api.dto';

export const APIOkResponse = <T extends Function>(data: T) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponse, data),
    ApiOkResponse({
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(data) },
            },
          },
        ],
      },
    }),
  );
};

export const APIPaginationResponse = <T extends Function>(data: T) => {
  return applyDecorators(
    ApiExtraModels(PaginationData, PaginationResponse, data),
    ApiOkResponse({
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginationData) },
                  {
                    properties: {
                      records: { items: { $ref: getSchemaPath(data) } },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

export const APIBadRequestResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      type: BadResponse,
      description: 'Bad Request',
    }),
  );
};
