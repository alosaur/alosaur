const clients = new Map<number, Function>();
let clientId = 0;
function dispatch(msg: string): void {
  for (const client of clients.values()) {
    client(msg);
  }
}

export async function ChatHandler(send: Function): Promise<void> {
  const id = ++clientId;
  clients.set(id, send);
  dispatch(`Connected: [${id}]`);
}
