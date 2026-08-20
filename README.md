# Wait For Me ❤️ — Version 2

This version adds **real-time communication between two phones** using a small Node.js WebSocket server.

## What works
- Two people can connect using the same couple code.
- Each person enters their own name.
- When one person taps **Notify my partner**, the other connected phone receives the alert immediately.
- The partner can reply:
  - I'm joining
  - Wait for me
  - Go ahead
- Online/offline connection status.
- Browser notification support where permitted.

## Run it on a computer
1. Install Node.js.
2. Open a terminal in this folder.
3. Run:
   `npm install`
4. Run:
   `npm start`
5. Open:
   `http://localhost:3000`

## Test with two phones
For two phones to communicate over the internet, the Node server needs to be hosted on a public HTTPS server. This package is prepared for deployment to a Node-compatible hosting provider.

Both phones then open the hosted address and enter the same code, for example `7K4P9`.

## Important
This is still a prototype. Couple accounts, permanent data storage, authentication, push notifications that work when the app is closed, and Netflix integration are the next production steps.
