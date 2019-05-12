export function getActionParams(url, route): string[] {
  const args = [];
  const queryParams = findSearchParams(url);
  if (queryParams) {
    const querys = route.params.filter(el => el.type === 'query')
                               .sort((a, b) => a.index - b.index);
    querys.forEach(query => {
      if (queryParams.has(query.name)) {
        args.push(queryParams.get(query.name));
      }
    });
  }
  return args;
}
function findSearchParams(url: string): URLSearchParams{
  if(url == null) return null;
  const searchs = url.split('?')[1];
  if(searchs == null) return null;
  return new URLSearchParams(searchs);
}