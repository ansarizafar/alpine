export interface RawResponse {
  writeStatus(status: string | ArrayBuffer): RawResponse;
  writeHeader(
    key: string | ArrayBuffer,
    value: string | ArrayBuffer,
  ): RawResponse;
  write(chunk: string | ArrayBuffer): RawResponse;
  end(body: string | ArrayBuffer): RawResponse;
  tryEnd(fullBodyOrChunk: string, totalSize: number): [boolean, boolean];
  close(): RawResponse;
  getWriteOffset(): number;
  onWritable(handler: (res: RawResponse) => boolean): RawResponse;
  onAborted(handler: (res: RawResponse) => void): RawResponse;
  onData(
    handler: (res: RawResponse, chunk: ArrayBuffer, isLast: boolean) => void,
  ): RawResponse;
}

export interface RawRequest {
  getHeader(lowerCaseKey: string): string;
  getParameter(index: number): string;
  getUrl(): string;
  getMethod(): string;
  getQuery(): string;
}
