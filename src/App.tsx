import { FormEvent, useCallback, useEffect, useState } from "react";
import { VStack } from "./ui";
import "./App.css";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(path: string) {
  await wait(300);

  return fetch(path).then((x) => x.json());
}

type Actor = { id: number; name: string };
type Job = { movieId: number | undefined; actorId: number | undefined };

function Form({ onSubmit }: { onSubmit: (data: Job) => unknown }) {
  const [movieId, setMovieId] = useState<number>();
  const [actorId, setActorId] = useState<number>();

  const [movies, setMovies] = useState<Array<{ id: number; name: string }>>([]);
  const [moviesIsLoading, setMoviesIsLoading] = useState(true);
  const [actors, internalSetActors] = useState<Actor[]>([]);
  const [actorsIsLoading, setActorsIsLoading] = useState(false);

  const setActors = useCallback((nextActors: Actor[]) => {
    internalSetActors(nextActors);

    setActorId((currentActorId) =>
      nextActors.find((p) => p.id === currentActorId)
        ? currentActorId
        : undefined,
    );
  }, []);

  useEffect(() => {
    fetchJSON("/api/movies")
      .then(setMovies)
      .then(() => setMoviesIsLoading(false));
  }, []);

  useEffect(() => {
    if (movieId) {
      setActorsIsLoading(true);
      fetchJSON(`/api/movies/${movieId}/people`)
        .then(setActors)
        .then(() => setActorsIsLoading(false));
    } else {
      setActors([]);
    }
  }, [movieId, setActors]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      onSubmit({ movieId, actorId });
    },
    [onSubmit, actorId, movieId],
  );

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="flex flex-col gap-2 m-2 p-2 bg-white border rounded">
        <legend className="font-bold text-lg bg-white px-2 border rounded">
          Choose a job
        </legend>
        <details>
          <summary>Instructions</summary>
          Here, you can pick a job in Hollywood. First, select your movie, then
          decide if you want to be assigned to a specific actor, or will take
          any job on set
        </details>
        <VStack className="">
          <label htmlFor="movieId">Movie:</label>
          <Select
            id="movieId"
            name="movie_id"
            className="flex-grow"
            onChange={(e) => setMovieId(parseInt(e.currentTarget.value, 10))}
          >
            <option selected disabled>
              {moviesIsLoading ? "Loading..." : "Select an option"}
            </option>
            {movies.map((tl) => (
              <option key={tl.id} value={tl.id}>
                {tl.name}
              </option>
            ))}
          </Select>
        </VStack>
        <VStack className="">
          <label htmlFor="actorId">Actor:</label>
          <Select
            id="actorId"
            name="actor_id"
            className="flex-grow"
            onChange={(e) =>
              setActorId(
                e.currentTarget.value
                  ? parseInt(e.currentTarget.value, 10)
                  : undefined,
              )
            }
            value={actorId}
          >
            <option selected value="">
              {movieId
                ? actorsIsLoading
                  ? "Loading..."
                  : "Any role is great"
                : "Select a movie"}
            </option>
            {actors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </VStack>
        <button className="border bg-sky-500 rounded p-1 text-white">
          Save
        </button>
      </fieldset>
    </form>
  );
}

function Select({ className, ...props }: React.HTMLProps<HTMLSelectElement>) {
  return (
    <select className={`border p-1 px-0.5 rounded ${className}`} {...props} />
  );
}

export default function App() {
  const [job, setJob] = useState<Job>();

  return (
    <VStack className="gap-6">
      <Form onSubmit={setJob} />
      {job && (
        <pre className="bg-gray-200 border rounded p-4">
          {JSON.stringify(job, null, 2)}
        </pre>
      )}
    </VStack>
  );
}

