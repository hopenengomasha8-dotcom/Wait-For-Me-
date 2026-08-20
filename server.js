const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const couples = new Map(); // code -> Set(ws)

const server = http.createServer((req, res) => {
  let file = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.join(publicDir, file);
  if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath)) {
    res.writeHead(404); return res.end("Not found");
  }
  const ext = path.extname(filePath);
  const types = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json"};
  res.writeHead(200, {"Content-Type": types[ext] || "text/plain"});
  fs.createReadStream(filePath).pipe(res);
});

const wss = new WebSocket.Server({ server });

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function broadcast(code, data, except) {
  const room = couples.get(code);
  if (!room) return;
  for (const client of room) if (client !== except) send(client, data);
}

wss.on("connection", ws => {
  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === "join") {
      const code = String(msg.code || "").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8);
      if (!code) return send(ws, {type:"error", message:"Enter a couple code."});
      if (!couples.has(code)) couples.set(code, new Set());
      const room = couples.get(code);
      if (room.size >= 2 && !room.has(ws))
        return send(ws, {type:"error", message:"This couple code already has two devices connected."});
      ws.code = code; ws.name = String(msg.name || "Partner").slice(0,40);
      room.add(ws);
      send(ws, {type:"joined", partnerCount:room.size});
      broadcast(code, {type:"partner_status", online:true, partnerCount:room.size}, ws);
      return;
    }

    if (!ws.code) return send(ws, {type:"error", message:"Join a couple first."});
    if (["notify","response"].includes(msg.type)) {
      broadcast(ws.code, {...msg, from: ws.name, sentAt: Date.now()}, ws);
    }
  });

  ws.on("close", () => {
    if (!ws.code) return;
    const room = couples.get(ws.code);
    if (room) {
      room.delete(ws);
      broadcast(ws.code, {type:"partner_status", online:false, partnerCount:room.size});
      if (!room.size) couples.delete(ws.code);
    }
  });
});

server.listen(PORT, () => console.log(`Wait For Me v2 running on http://localhost:${PORT}`));
