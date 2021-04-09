const conn = await Deno.connect({ hostname: "localhost", port: 4500 });

let i = 0;

setInterval(async () => {
  i++;
  await conn.write(new TextEncoder().encode("1 test message " + i));
}, 1000);

const conn2 = await Deno.connect({ hostname: "localhost", port: 4500 });

let i2 = 0;

setInterval(async () => {
  i2++;
  await conn2.write(new TextEncoder().encode("2 test message " + i2));
}, 1000);

// conn.close();
// console.log(123)
