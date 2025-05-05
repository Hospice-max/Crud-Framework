const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connecté');

  socket.on('message', (message) => {
    console.log('Reçu:', message);
    // Broadcast the message to all clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('Client déconnecté');
  });
});

console.log('Lancement sur ws://localhost:8080');
