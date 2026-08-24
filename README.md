# Wait For Me ❤️ — Version 2

A real-time couple watch-notification prototype.

## Included
- Private couple room codes
- Two phones/browsers in the same room
- Real-time watch requests and responses
- Online/offline status
- Mobile-first interface
- Optional browser notifications can be added later

## Run
Requires Node.js 18+.

    npm install
    npm start

Open http://localhost:3000

Use the same room code on both devices.

## Deployment
Version 2 uses Node.js + Socket.IO, so GitHub Pages alone cannot run the backend. Deploy this project on a Node-compatible host and use `npm start`.

This prototype does not control Netflix or access Netflix accounts. It coordinates two people watching the same show.

## Next production stage
Authentication, persistent couples, push notifications, invite links, show search, watch history, database, privacy/security, and production monitoring.
