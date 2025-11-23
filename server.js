import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HiAnime } from "aniwatch";
import { cors } from "hono/cors"; // <--- New import

// Initialize the Hono app
const app = new Hono();

// Configure CORS to allow all origins (Allowed to all origins)
app.use(
    cors({
        origin: "*", // Allows all origins
        allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
    })
);

// Initialize the aniwatch client
const client = new HiAnime.Scraper();

// Define a simple route to test the core functionality
app.get("/api/v2/home", async (c) => {
    try {
        // Get home page data
        const homePageData = await client.getHomePage();
        return c.json({
            status: "success",
            results: homePageData
        });
    } catch (error) {
        console.error("Error during search:", error);
        return c.json({
            status: "error",
            message: error.message
        }, 500);
    }
});

// Health check route
app.get("/health", (c) => c.text("daijoubu", 200));

// Start the server
const port = 3000;
serve({
    port,
    fetch: app.fetch,
}, (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
});
