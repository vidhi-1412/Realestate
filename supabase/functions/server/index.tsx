import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.42.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = "make-5a209d6f-images";

// Ensure bucket exists on startup
try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      console.log("Creating bucket", BUCKET_NAME);
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
    }
} catch (e) {
    console.error("Error checking/creating bucket:", e);
}

const PREFIX = "/make-server-5a209d6f";

// Health check endpoint
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: "ok" });
});

// --- PROJECTS ---

app.get(`${PREFIX}/projects`, async (c) => {
  try {
    const projects = (await kv.get("projects")) || [];
    // Generate signed URLs for images
    const projectsWithUrls = await Promise.all(projects.map(async (p: any) => {
      if (p.imagePath) {
        const { data } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(p.imagePath, 3600);
        return { ...p, imageUrl: data?.signedUrl };
      }
      return p;
    }));
    return c.json(projectsWithUrls);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

app.post(`${PREFIX}/projects`, async (c) => {
  try {
    const body = await c.req.json();
    const projects = (await kv.get("projects")) || [];
    // Add new project
    const newProject = { ...body, id: crypto.randomUUID() };
    projects.push(newProject);
    await kv.set("projects", projects);
    return c.json({ success: true, project: newProject });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to add project" }, 500);
  }
});

// --- CLIENTS ---

app.get(`${PREFIX}/clients`, async (c) => {
  try {
    const clients = (await kv.get("clients")) || [];
    const clientsWithUrls = await Promise.all(clients.map(async (c: any) => {
      if (c.imagePath) {
        const { data } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(c.imagePath, 3600);
        return { ...c, imageUrl: data?.signedUrl };
      }
      return c;
    }));
    return c.json(clientsWithUrls);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch clients" }, 500);
  }
});

app.post(`${PREFIX}/clients`, async (c) => {
  try {
    const body = await c.req.json();
    const clients = (await kv.get("clients")) || [];
    const newClient = { ...body, id: crypto.randomUUID() };
    clients.push(newClient);
    await kv.set("clients", clients);
    return c.json({ success: true, client: newClient });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to add client" }, 500);
  }
});

// --- CONTACT ---

app.get(`${PREFIX}/contact`, async (c) => {
  try {
    const submissions = (await kv.get("contact_submissions")) || [];
    return c.json(submissions);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch submissions" }, 500);
  }
});

app.post(`${PREFIX}/contact`, async (c) => {
  try {
    const body = await c.req.json();
    const submissions = (await kv.get("contact_submissions")) || [];
    const newSubmission = { ...body, id: crypto.randomUUID(), submittedAt: new Date().toISOString() };
    submissions.push(newSubmission);
    await kv.set("contact_submissions", submissions);
    return c.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to submit contact form" }, 500);
  }
});

// --- NEWSLETTER ---

app.get(`${PREFIX}/newsletter`, async (c) => {
  try {
    const subscriptions = (await kv.get("newsletter_subscriptions")) || [];
    return c.json(subscriptions);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch subscriptions" }, 500);
  }
});

app.post(`${PREFIX}/newsletter`, async (c) => {
  try {
    const body = await c.req.json();
    const subscriptions = (await kv.get("newsletter_subscriptions")) || [];
    // Simple duplicate check
    if (!subscriptions.some((s: any) => s.email === body.email)) {
      subscriptions.push({ ...body, subscribedAt: new Date().toISOString() });
      await kv.set("newsletter_subscriptions", subscriptions);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});

// --- UPLOAD ---

app.post(`${PREFIX}/upload`, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      console.error("Storage upload error:", error);
      return c.json({ error: "Upload failed: " + error.message }, 500);
    }

    // Return the path so we can store it in the KV object
    return c.json({ path: data.path });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

Deno.serve(app.fetch);
