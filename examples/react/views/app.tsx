// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import React from "https://jspm.dev/react@16.13.1";
// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://jspm.dev/react-dom@16.13.1/server.js";

const Home = () => (
  <div>
    <p>Hello to my page!</p>
    <a href="/contacts">Go to contacts</a>
  </div>
);

const Contacts = () => (
  <div>
    <p>Contacts page</p>
    <a href="/">Go to home</a>
  </div>
);

export const getPage = (path: string, model: Object) => {
  return ReactDOMServer.renderToString(
    path === "contacts" ? <Contacts /> : <Home />,
  );
};
