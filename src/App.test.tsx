import userEvent from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
import { Form } from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/movies", () => {
    return HttpResponse.json([{ id: 1, name: "A cool movie!" }]);
  }),
  http.get("/api/movies/1/people", () => {
    return HttpResponse.json([{ id: 1, name: "Daniel Ma" }]);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("initial state", () => {
  const { asFragment } = render(<Form onSubmit={() => void 0} />);
  expect(asFragment()).toMatchSnapshot();
});

it("select a movie", async () => {
  const user = userEvent.setup();
  const { asFragment } = render(<Form onSubmit={() => void 0} />);

  await screen.findByText("A cool movie!");
  await user.selectOptions(screen.getByLabelText("Movie:"), ["1"]);
  await screen.findByText("Daniel Ma");
  await user.selectOptions(screen.getByLabelText("Actor:"), ["Daniel Ma"]);

  expect(asFragment()).toMatchSnapshot();
});

