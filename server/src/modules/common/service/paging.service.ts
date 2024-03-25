import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Response } from 'express';

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
}
