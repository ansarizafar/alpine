import { HTTPMethod } from './constants';
import { RawRequest } from './interfaces';

export class Request {
  public method: HTTPMethod;
  public originalUrl: any;
  public url: string;

  constructor(private readonly raw: RawRequest) {
    this.url = this.raw.getUrl();
    this.method = this.raw.getMethod().toUpperCase() as HTTPMethod;
  }
}
