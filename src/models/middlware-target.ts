export interface MiddlwareTarget {
    onPreRequest(req, res): Promise<any>;
    onPostRequest(req, res): Promise<any>;
}