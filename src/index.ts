import Server from './server';

const server = new Server();

server.use((req, res, next) => {
  next();
});

server.get('/', (req, res) => {
  return res.send({ hello: 'world' });
});

server.listen(process.env.PORT || 3005);
