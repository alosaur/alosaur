export interface ViewRenderConfig {
    type: 'dejs';
    basePath: string;
    getBody: (path: string, model: Object, config: ViewRenderConfig) => any;
}
