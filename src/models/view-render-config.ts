export interface ViewRenderConfig {
    type: string;
    basePath: string;
    getBody: (path: string, model: Object, config: ViewRenderConfig) => any;
}
