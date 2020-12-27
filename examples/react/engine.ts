import { getPage } from "./views/app.tsx";

class ReactSSREngine {
  public render(path: string, model: Object) {
    return getPage(path, model);
  }
}

export const engine = new ReactSSREngine();
