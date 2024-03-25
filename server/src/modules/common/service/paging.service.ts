import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class PagingService {
  createPaginationResponse(res: Response, paginateResult: PaginateResult<any>) {
    res.setHeader('x-total-count', paginateResult.totalDocs.toString());
    return res.send(paginateResult.docs);
  }
}
