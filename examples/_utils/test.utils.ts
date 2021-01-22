export function delay(duration: number): Promise<void> {
  return new Promise<void>(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}
