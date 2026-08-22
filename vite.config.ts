import { defineConfig } from "vite";
import type { Connect, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const insuranceApplicationPath = "/api/insurance-applications";

const handleInsuranceApplication: Connect.NextHandleFunction = (
  request,
  response,
  next,
) => {
  if (request.url !== insuranceApplicationPath) {
    next();
    return;
  }

  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    response.end();
    return;
  }

  request.on("end", () => {
    response.statusCode = 201;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ success: true }));
  });
  request.resume();
};

function mockInsuranceApplicationApi(): Plugin {
  return {
    name: "mock-insurance-application-api",
    configureServer(server) {
      server.middlewares.use(handleInsuranceApplication);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleInsuranceApplication);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mockInsuranceApplicationApi()],
});
