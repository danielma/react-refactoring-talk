import { FormEvent, useCallback, useEffect, useState } from "react";
import { Select, VStack } from "./ui";
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

export function Form({
  onSubmit,
  defaultJob,
}: {
  onSubmit: (data: Job) => unknown;
  defaultJob?: Partial<Job> | undefined;
}) {
  const [movieId, setMovieId] = useState<number | undefined>(
    defaultJob?.movieId,
  );
  const [actorId, setActorId] = useState<number | undefined>(
    defaultJob?.actorId,
  );

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

  const warnings = [
    defaultJob?.movieId &&
      movieId !== defaultJob.movieId &&
      "Switching movie sets!",
  ].filter(Boolean);

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="flex flex-col gap-2 m-2 p-2 bg-white border rounded shadow">
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
            value={movieId}
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
            <option value="">
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
        {warnings.length > 0 && (
          <div className="border text-yellow-950 bg-yellow-200 border-yellow-600 p-2 rounded">
            {warnings.join(",")}
          </div>
        )}
        <button className="border border-sky-700 bg-sky-500 rounded p-1 text-white shadow relative before:content-[''] before:absolute before:top-0 before:inset-x-px before:h-px before:bg-sky-300 before:opacity-80">
          Save
        </button>
      </fieldset>
    </form>
  );
}

function tryParseJson(source: string) {
  try {
    return JSON.parse(source);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

const InitialJobLink = ({
  job,
  className,
  ...props
}: { job: Partial<Job> } & React.HTMLProps<HTMLAnchorElement>) => (
  <a
    className={`text-sky-700 underline ${className}`}
    href={`?initialJob=${encodeURIComponent(JSON.stringify(job))}`}
    {...props}
  />
);

export default function App() {
  const [job, setJob] = useState<Job>(() => {
    const params = new URL(window.location.toString()).searchParams;
    const initialJob = params.get("initialJob");

    return tryParseJson(decodeURIComponent(initialJob || ""));
  });

  return (
    <VStack className="gap-6">
      <Form onSubmit={setJob} defaultJob={job} />
      {job && (
        <pre className="bg-gray-200 border rounded p-4">
          {JSON.stringify(job, null, 2)}
        </pre>
      )}
      <div className="bg-white border rounded p-4">
        <ul>
          <li>
            <InitialJobLink job={{ movieId: 4 }}>Initial movie</InitialJobLink>
          </li>
          <li>
            <InitialJobLink job={{ movieId: 2, actorId: 7 }}>
              Initial movie & actor
            </InitialJobLink>
          </li>
        </ul>
      </div>
    </VStack>
  );
}

