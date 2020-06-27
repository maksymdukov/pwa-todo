export const wait = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout * 1000);
  });
