import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dataSource from "./public/tasks_source.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "",
        bypass(req, res) {
          res.setHeader("Content-Type", "application/json");

          // /api/task_lists
          // /api/task_lists/${id}/people
          const parts = req.url.slice(1).split("/").slice(1).join("/");
          const peopleMatch = parts.match(/^task_lists\/(\d+)\/people$/);

          if (parts === "task_lists") {
            const justTheLists = dataSource.map(({ id, name }) => ({
              id,
              name,
            }));
            res.end(JSON.stringify(justTheLists));
          } else if (peopleMatch) {
            const listId = parseInt(peopleMatch[1], 10);
            const taskList = dataSource.find((tl) => tl.id === listId);

            if (taskList) {
              res.end(JSON.stringify(taskList.people));
            }
          }

          return false;
        },
      },
    },
  },
});
