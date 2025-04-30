import userEvent from "@testing-library/user-event";
import { screen, render, cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
import { Form, Job } from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/movies", () => {
    return HttpResponse.json([{ id: 1, name: "A cool movie!" }]);
  }),
  http.get("/api/movies/1/people", () => {
    return HttpResponse.json([{ id: 2, name: "Daniel Ma" }]);
  }),
  http.get("/api/movies/2/people", () => {
    return HttpResponse.json([]);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
afterEach(() => cleanup());

it("initial state", () => {
  const { asFragment } = render(<Form onSubmit={() => void 0} />);
  expect(asFragment()).toMatchSnapshot();
});

it("select a movie", async () => {
  const user = userEvent.setup();
  let response: Job | null = null;
  const handleSubmit: React.ComponentProps<typeof Form>["onSubmit"] = (e) =>
    (response = e);
  const { asFragment } = render(<Form onSubmit={handleSubmit} />);

  await screen.findByText("A cool movie!");
  await user.selectOptions(screen.getByLabelText("Movie:"), ["1"]);
  await screen.findByText("Daniel Ma");
  await user.selectOptions(screen.getByLabelText("Actor:"), ["Daniel Ma"]);
  await user.click(screen.getByRole("button"));

  expect(asFragment()).toMatchSnapshot();
  expect(response).toEqual({ movieId: 1, actorId: 2 });
});

it("change the initial movie", async () => {
  const user = userEvent.setup();
  const { asFragment } = render(
    <Form onSubmit={() => void 0} defaultJob={{ movieId: 2 }} />,
  );

  expect(asFragment()).toMatchSnapshot();

  await screen.findByText("A cool movie!");
  await user.selectOptions(screen.getByLabelText("Movie:"), ["1"]);

  expect(asFragment()).toMatchSnapshot();
});

