import { config } from './config';
import http from 'http';
import socketio from 'socket.io';
import socketioJWT from 'socketio-jwt';

import app from './app';

declare global {
  namespace SocketIO {
    interface Socket {
      decoded_token: {
        sub: string;
      };
    }
  }
}

const httpServer = http.createServer(app);

/**
 * Error Handler. Provides full stack - remove for production
 */
// app.use(errorHandler());

export const io = socketio(httpServer, {
  pingTimeout: 3000,
  pingInterval: 5000,
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // @ts-ignore
      'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
      'Access-Control-Allow-Credentials': true,
    };
    // @ts-ignore
    res.writeHead(200, headers);
    // @ts-ignore
    res.end();
  },
});

io.use(
  socketioJWT.authorize({
    secret: config.JWT_SECRET,
    handshake: true,
    auth_header_required: true,
  })
);

io.on('connection', (socket) => {
  console.log('Client connected');

  // Join channel named as user id in MongoDB
  socket.join(socket.decoded_token.sub);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

/**
 * Start Express server.
 */
const server = httpServer.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
