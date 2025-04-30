const howLongToWait = process.env.NODE_ENV === "test" ? 0 : 300;

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJSON(path: string) {
  await wait(howLongToWait);

  return fetch(path).then((x) => x.json());
}

