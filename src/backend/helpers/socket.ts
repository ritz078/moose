const socket = require('socket.io');

export const socketIo = {
  server: null,
  create(server) {
    return this.server = socket.listen(server);
  },
  get() {
    return this.server;
  }
}
