# AWS WebSocket Real-Time Online Indicator

This guide shows how to add a real-time "Currently Online" indicator using API Gateway WebSockets and DynamoDB.

## 1. Create the DynamoDB table

Create a table named `ActiveConnections` with:
- Partition key: `connectionId` (String)
- Optionally add `connectedAt` or `lastSeen` attributes for debugging
- Set a reasonable read/write capacity or use on-demand mode for low traffic

## 2. Create the WebSocket API

1. Open the API Gateway console.
2. Create a new **WebSocket API**.
3. Use route selection expression: `$request.body.action`
4. Add the following routes:
   - `$connect`
   - `$disconnect`
   - `sendOnlineStatus`

## 3. Create Lambda functions

Create these Lambda functions in AWS Console using Node.js 18.x or newer:

### `$connect` handler
- Adds `connectionId` to `ActiveConnections`
- Returns 200 to accept the connection

### `$disconnect` handler
- Removes the `connectionId` from `ActiveConnections`
- Cleans up stale connections

### `sendOnlineStatus` handler
- Scans `ActiveConnections` to determine the current online count
- Uses `ApiGatewayManagementApi` to broadcast the count to connected clients
- Removes stale connections if the post fails with a stale connection error

## 4. Configure route integrations

Attach each route to the corresponding Lambda function:
- `$connect` → `connect.js`
- `$disconnect` → `disconnect.js`
- `sendOnlineStatus` → `sendOnlineStatus.js`

Set the integration request to use the WebSocket API route selection expression.

## 5. Deploy the WebSocket API

1. Create a stage such as `prod` or `staging`.
2. Deploy the API.
3. Note the WebSocket URL, which looks like:
   `wss://<api-id>.execute-api.<region>.amazonaws.com/<stage>`

## 6. Frontend configuration

Add the following environment variable:

```env
VITE_WS_URL=wss://<api-id>.execute-api.<region>.amazonaws.com/<stage>
```

The frontend hook connects on page load, sends a heartbeat every 30 seconds, and displays the live online count.

## 7. React integration

The hook is implemented in `src/hooks/useWebSocket.jsx`.
It supports:
- connecting to the WebSocket on page load
- heartbeat pings every 30 seconds
- automatic reconnection on disconnect
- parsing `onlineCount` messages from the backend

An indicator is rendered in `src/components/sections/Hero.jsx`.

## 8. Comparison: WebSockets vs REST APIs

- REST APIs are request/response only.
- WebSockets keep a persistent TCP connection and allow the server to push updates to clients.
- Use WebSockets for real-time features like presence, chat, collaboration, and live notifications.

## 9. Connection management in serverless

- `$connect` registers the client connection.
- `$disconnect` removes the client connection.
- Use DynamoDB to track active connections in a durable store.
- The backend can broadcast messages to all active connection IDs.
- In AWS, stale connections are often cleaned when a post fails with a `GoneException`.

## 10. Use cases for real-time features

- live online presence indicators
- chat and messaging
- live dashboard updates
- collaborative editing
- server-sent notifications for changes

## 11. Pricing

- API Gateway WebSocket APIs are metered by messages and connection minutes.
- The first 1,000,000 messages per month are free in many AWS regions.
- DynamoDB costs are usually low for small connection tables.
- Keep message payloads small to reduce costs.

## 12. Security notes

- Do not expose the WebSocket URL publicly if it should be restricted.
- Add authentication if you need private or admin-only real-time subscriptions.
- For public presence status, the connection itself is sufficient.
