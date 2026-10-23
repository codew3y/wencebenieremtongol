// Vercel only discovers serverless functions in a top-level api/ folder, so
// this file is the route and nothing more. The handler lives in backend/,
// alongside its tests.
export { default } from "../backend/pokes.js";
