import { Request } from 'express';
import { UserAuthInterface } from './UserAuthInterface';
interface RequestWithUserInterface extends Request {
  user: UserAuthInterface;
}

export default RequestWithUserInterface;
