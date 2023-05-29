/// <reference types="node" />
import WebSocket from 'ws';
import http from 'http';
export declare function createWebSocketServer(server: http.Server): {
    wss: WebSocket.Server<WebSocket.WebSocket>;
    wsClients: Set<WebSocket>;
};
