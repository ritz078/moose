import * as socket from 'socket.io';

export default {
  server: null,
  create(server) {
    this.server = socket.listen(server);
    return this.server;
  },
  get() {
    return this.server;
  },
};
