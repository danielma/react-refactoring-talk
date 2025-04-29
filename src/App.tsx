import { useCallback, useEffect, useState } from "react";
import "./App.css";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(path: string) {
  await wait(300);

  return fetch(path).then((x) => x.json());
}

type Person = { id: number; name: string };

function App() {
  const [taskListId, setTaskListId] = useState<number>();
  const [assigneeId, setAssigneeId] = useState<number>();

  const [taskLists, setTaskLists] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [taskListsIsLoading, setTaskListsIsLoading] = useState(true);
  const [people, internalSetPeople] = useState<Person[]>([]);
  const [peopleIsLoading, setPeopleIsLoading] = useState(false);

  const setPeople = useCallback(
    (nextPeople: Person[]) => {
      internalSetPeople(nextPeople);

      if (!nextPeople.find((p) => p.id === assigneeId)) {
        setAssigneeId(undefined);
      }
    },
    [assigneeId],
  );

  useEffect(() => {
    fetchJSON("/api/task_lists")
      .then(setTaskLists)
      .then(() => setTaskListsIsLoading(false));
  }, []);

  useEffect(() => {
    if (taskListId) {
      setPeopleIsLoading(true);
      fetchJSON(`/api/task_lists/${taskListId}/people`)
        .then(setPeople)
        .then(() => setPeopleIsLoading(false));
    } else {
      setPeople([]);
    }
  }, [taskListId, setPeople]);

  return (
    <fieldset className="flex flex-col gap-4 m-2 p-2 bg-white border rounded">
      <legend className="font-bold text-lg bg-white px-2 border rounded">
        Task Editor
      </legend>
      <HStack className="gap-1 items-center">
        <label htmlFor="taskListId">Task List:</label>
        <Select
          id="taskListId"
          className="flex-grow"
          onChange={(e) => setTaskListId(parseInt(e.currentTarget.value, 10))}
        >
          <option selected disabled>
            {taskListsIsLoading ? "Loading..." : "Select an option"}
          </option>
          {taskLists.map((tl) => (
            <option key={tl.id} value={tl.id}>
              {tl.name}
            </option>
          ))}
        </Select>
      </HStack>
      <HStack className="gap-1 items-center">
        <label htmlFor="assigneeId">Assignee:</label>
        <Select
          id="assigneeId"
          className="flex-grow"
          onChange={(e) => setAssigneeId(parseInt(e.currentTarget.value, 10))}
          value={assigneeId}
        >
          <option selected>
            {taskListId
              ? peopleIsLoading
                ? "Loading..."
                : "No assignee"
              : "Select a task list"}
          </option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </HStack>
      <button className="border bg-sky-500 rounded p-1 text-white">Save</button>
    </fieldset>
  );
}

function Select({ className, ...props }: React.HTMLProps<HTMLSelectElement>) {
  return (
    <select className={`border p-1 px-0.5 rounded ${className}`} {...props} />
  );
}

function HStack({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div className={`flex flex-row ${className}`} {...props} />;
}

export default App;

