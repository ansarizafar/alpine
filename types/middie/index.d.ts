declare module 'middie' {
  class MiddieHandler {
    public use(
      params:
        | [string, (req: any, res: any, ctx?: any) => any]
        | [(req: any, res: any, ctx?: any) => any],
    ): any;
    public run(req: any, res: any, ctx?: any): any;
  }

  export default function(
    complete: (err: any, req: any, res: any, ctx: any) => any,
  ): MiddieHandler;
}
