export const COMMENTS_ON_PAGE = 6
let API_URL, WEBSOCKET_API_URL

const apiDomain = 'optimised-comments.onrender.com'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  API_URL = `http://localhost:5000`
  WEBSOCKET_API_URL = 'ws://localhost:5000'
} else {
  API_URL = `https://${apiDomain}`
  WEBSOCKET_API_URL = `wss://${apiDomain}`
}
export {API_URL, WEBSOCKET_API_URL}
