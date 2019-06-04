export interface MidlwareTarget {
    onPreRequest(req, res): Promise<any>;
    onPostRequest(req, res): Promise<any>;
}