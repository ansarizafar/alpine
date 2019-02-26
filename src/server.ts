import uWS from 'uWebSockets.js';
import Router from 'find-my-way';
import Middie, { MiddieHandler } from 'middie';
import { Response } from './response';
import { Request } from './request';

type RequestCallback = (req: Request, res: Response) => any;
type MiddlewareCallback = (
  req: Request,
  res: Response,
  next: (params?: any) => any,
) => any;

class Server {
  private readonly server: uWS.TemplatedApp;
  private readonly router: Router.Instance<any> = Router();
  private readonly middie: MiddieHandler;

  constructor(options: uWS.AppOptions = {}) {
    this.server = uWS.App(options);

    this.get = this.get.bind(this);
    this.middlewareCallback = this.middlewareCallback.bind(this);
    this.onRunMiddleware = this.onRunMiddleware.bind(this);

    this.middie = Middie(this.onRunMiddleware);
  }

  get(path: string, cb: RequestCallback) {
    this.router.get(path, cb as any);
    return this;
  }

  use(...params: [string, MiddlewareCallback] | [MiddlewareCallback]) {
    this.middie.use(params);
  }

  listen(port: number | string, cb?: (port: number) => any) {
    const usePort = typeof port === 'string' ? Number(port) : port;

    this.server
      .any('*', async (rawRes, rawReq) => {
        const res = new Response(rawRes);
        const req = new Request(rawReq);

        res.getRes().onAborted(() => {
          res.setAborted();
        });

        const route = this.router.find(req.method, req.url);

        if (route === null) {
          return res.code(404).send('Not found');
        }

        try {
          this.middie.run(req, res, { context: 'object' });
        } catch (e) {
          res.code(500).send('Internal server error');
        }
      })
      .listen(usePort, () => {
        if (cb) {
          cb(usePort);
        }
      });
  }

  protected async handleRequest(req: Request, res: Response, context?: any) {
    const route = this.router.find(req.method, req.url);

    if (route) {
      try {
        await route.handler(req as any, res as any, {}, undefined);
      } catch (e) {
        this.middlewareCallback(e, req, res);
      }
      return;
    }

    return res.code(404).send('Not found');
  }

  protected middlewareCallback(err: Error, req: Request, res: Response) {
    if (res.isSent() || res.isAborted()) {
      return;
    }

    if (err !== null) {
      res.code(500).send(err.message);
      return;
    }

    this.onRunMiddleware(null, req, res);
  }

  protected async onRunMiddleware(
    err: any,
    req: Request,
    res: Response,
    context?: any,
  ) {
    if (err && !res.isSent()) {
      return res.code(500).send('Internal server error');
    }
    this.handleRequest(req, res, context);
  }
}

export default Server;
