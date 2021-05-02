const conn = await Deno.connect({ hostname: "localhost", port: 4500 });
const delimenter = "#";

let i = 0;

setInterval(async () => {
  i++;

  const pattern = { cmd: "sum" };
  const data = { test: "message" };

  const req = JSON.stringify(pattern) + delimenter + JSON.stringify(data);

  await conn.write(new TextEncoder().encode(req));

  const res = new Uint8Array(124 * 1024);
  const nread = await conn.read(res);
  if (nread !== null) {
    // conn.close();
    const page = new TextDecoder().decode(res.subarray(0, nread));
    console.log("page:", page);
  }
}, 1000);

const conn2 = await Deno.connect({ hostname: "localhost", port: 4500 });

let i2 = 0;

setInterval(async () => {
  i2++;
  const pattern = { cmd: "sum" };
  const data = { test: "message" };

  const req = JSON.stringify(pattern) + delimenter + JSON.stringify(data);

  await conn2.write(new TextEncoder().encode(req));

  const res = new Uint8Array(124 * 1024);
  const nread = await conn2.read(res);
  if (nread !== null) {
    // conn.close();
    const page = new TextDecoder().decode(res.subarray(0, nread));
    console.log("page2:", page);
  }
}, 200);
