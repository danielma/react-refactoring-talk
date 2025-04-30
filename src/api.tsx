async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJSON(path: string) {
  await wait(300);

  return fetch(path).then((x) => x.json());
}
