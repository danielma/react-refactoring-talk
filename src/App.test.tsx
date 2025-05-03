import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { useJobForm } from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/movies", () => {
    return HttpResponse.json([
      { id: 1, name: "A cool movie!" },
      { id: 2, name: "The sequel" },
    ]);
  }),
  http.get("/api/movies/1/people", () => {
    return HttpResponse.json([{ id: 2, name: "Daniel Ma" }]);
  }),
  http.get("/api/movies/2/people", () => {
    return HttpResponse.json([
      { id: 2, name: "Daniel Ma" },
      { id: 3, name: "Zurg Burgess" },
    ]);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
afterEach(() => cleanup());

describe("useJobForm", () => {
  it("select a movie", async () => {
    const { rerender, result } = renderHook(() => useJobForm({}));

    expect(result.current.movieId).toBeUndefined();

    await waitFor(() => expect(result.current.moviesIsLoading).toBe(false));
    expect(result.current.movies).toEqual(
      expect.arrayContaining([{ id: 1, name: "A cool movie!" }]),
    );
    result.current.setMovieId(1);
    rerender();
    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));
    expect(result.current.actors).toEqual(
      expect.arrayContaining([{ id: 2, name: "Daniel Ma" }]),
    );
  });

  it("initially selected actor works", async () => {
    const { result } = renderHook(() =>
      useJobForm({ defaultJob: { movieId: 2, actorId: 2 } }),
    );

    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));

    expect(result.current.actorId).toEqual(2);
    expect(result.current.movieId).toEqual(2);
  });

  it("change the movie, but keep the actor", async () => {
    const { rerender, result } = renderHook(() =>
      useJobForm({ defaultJob: { movieId: 2, actorId: 2 } }),
    );
    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));

    result.current.setMovieId(1);
    rerender();
    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));

    expect(result.current.actorId).toEqual(2);
    expect(result.current.warnings).toHaveProperty("length", 0);
  });

  it("change the movie, and the actor is no longer available", async () => {
    const { rerender, result } = renderHook(() =>
      useJobForm({ defaultJob: { movieId: 2, actorId: 3 } }),
    );
    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));

    result.current.setMovieId(1);
    rerender();
    await waitFor(() => expect(result.current.actorsIsLoading).toBe(false));

    expect(result.current.actorId).toBeUndefined();
    expect(result.current.warnings).toHaveProperty("length", 1);
  });
});

