import { RawResponse } from './interfaces';

export class Response {
  protected sent: boolean = false;
  protected aborted: boolean = false;
  protected statusCode = 200;
  protected headers: Map<string, string> = new Map();
  protected _context: Map<string, any> = new Map();

  constructor(private readonly res: RawResponse) {}

  getRes() {
    return this.res;
  }

  code(code: number) {
    this.statusCode = code;
    return this;
  }

  header(key: string, value: string) {
    this.headers.set(key, value);
    return this;
  }

  getHeader(key: string) {
    return this.headers.get(key);
  }

  hasHeader(key: string) {
    return this.headers.has(key);
  }

  removeHeader(key: string) {
    return this.headers.delete(key);
  }

  type(contentType: string) {
    this.headers.set('Content-Type', contentType);
    return this;
  }

  isAborted() {
    return this.aborted === true;
  }

  setAborted(aborted = true) {
    this.aborted = aborted;
  }

  isSent() {
    return this.sent === true;
  }

  context() {
    return this.context;
  }

  send(data: any) {
    if (!this.sent && !this.aborted) {
      const stringified =
        typeof data === 'string' ? data : JSON.stringify(data);
      this.res.writeStatus(String(this.statusCode));
      this.res.end(stringified);
      this.sent = true;
    }
  }
}
