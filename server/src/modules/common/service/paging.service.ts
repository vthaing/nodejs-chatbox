import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Request, Response } from 'express';

const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class PagingService {
  createPaginationResponse(res: Response, paginateResult: PaginateResult<any>) {
    const existedExposedHeaders =
      res.getHeader('Access-Control-Expose-Headers') ?? '';

    res.setHeader(
      'Access-Control-Expose-Headers',
      (existedExposedHeaders ? existedExposedHeaders + ', ' : '') +
        ' x-total-count',
    );

    res.setHeader('x-total-count', paginateResult.totalDocs);
    return res.send(paginateResult.docs);
  }

  getPagingOptionsFromRequest(req: Request) {
    const start = parseInt(req.query['_start'].toString() ?? '0');

    const end = parseInt(
      req.query['_end'].toString() ?? DEFAULT_PAGE_SIZE.toString(),
    );
    const pageSize = end - start ?? DEFAULT_PAGE_SIZE;

    return {
      offset: start,
      limit: pageSize,
    };
  }
}
