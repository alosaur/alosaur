import { App } from "../src/mod.ts";
import { HomeArea } from "./areas/home/home.area.ts";
import { InfoArea } from "./areas/info/info.area.ts";
import { Log } from "./middlwares/log.middlware.ts";

// import "../src/injection/reflect-metadata.ts";

import { injectable, container } from '../src/injection/index.ts';

export class Foo {
  getLog(){
    console.log(11111111111);
  }
}

@injectable()
export class Bar {
  constructor(public myFoo: Foo) {
    // myFoo.getLog();
  }
}


const myBar = container.resolve(Bar);

console.log(myBar);

const app = new App({
  areas: [HomeArea, InfoArea],
  middlewares: [Log]
});

app.listen();