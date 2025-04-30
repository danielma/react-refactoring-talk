import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dataSource from "./public/tasks_source.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    include: ["**/*.test.tsx"],
  },
  server: {
    proxy: {
      "/api": {
        target: "",
        bypass(req, res) {
          res.setHeader("Content-Type", "application/json");

          // /api/movies
          // /api/movies/${id}/people
          const parts = req.url.slice(1).split("/").slice(1).join("/");
          const peopleMatch = parts.match(/^movies\/(\d+)\/people$/);

          if (parts === "movies") {
            const justTheLists = dataSource.map(({ id, name }) => ({
              id,
              name,
            }));
            res.end(JSON.stringify(justTheLists));
          } else if (peopleMatch) {
            const movieId = parseInt(peopleMatch[1], 10);
            const movie = dataSource.find((m) => m.id === movieId);

            if (movie) {
              res.end(JSON.stringify(movie.people));
            }
          }

          return false;
        },
      },
    },
  },
});
