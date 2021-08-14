const clients = new Map<number, WebSocket>();
let clientId = 0;

function dispatch(msg: string): void {
  for (const client of clients.values()) {
    client.send(msg);
  }
}

export function ChatHandler(socket: WebSocket) {
  const id = ++clientId;

  clients.set(id, socket);

  socket.onopen = () => {
    console.log("socket opened");
    dispatch(`Connected: [${id}]`);
  };
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    dispatch(`[${id}]: ${e.data}`);
  };
  socket.onerror = (e) => console.log(`[${id}]: socket errored`);
  socket.onclose = () => clients.delete(id);
}
