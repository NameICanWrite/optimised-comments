import WebSocket from 'ws'
import http from 'http'
import {Express} from 'express'


export function createWebSocketServer(server: http.Server) {
  const wss = new WebSocket.Server({ server });

  // Store the connected WebSocket clients
  const wsClients = new Set<WebSocket>();

  // WebSocket connection handler
  wss.on('connection', (ws: WebSocket) => {
    wsClients.add(ws);
    console.log('A client connected');

    // WebSocket close handler
    ws.on('close', () => {
      wsClients.delete(ws);
      console.log('A client disconnected');
    });
  });



  return {
    wss,
    wsClients,
  };
}
