import {
  Application,
  Context,
  isHttpError,
  Router,
  RouterContext,
  send,
  Status,
} from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { wait } from "../services/helpers.ts";
import { logger } from "../services/logger.ts";

function notFound(context: Context) {
  context.response.status = Status.NotFound;
  context.response.body =
    `<html><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
}

const router = new Router();
router.get("/", (context: RouterContext) => {
  context.response.body = "Hello world!";
});

router.get("/random", (context: RouterContext) => {
  const rnd = Math.random();
  context.response.body = rnd;
  context.response.status = rnd > 0.5 ? 200 : 422;
});
router.get("/payload", async (context) => {
  logger.info(Deno.cwd(), context.request.url.pathname);
  await send(context, "", {
    root: `${Deno.cwd()}/test`,
    index: "oak.server.ts",
  });
});

router.get("/timeout", async (context: RouterContext) => {
  await wait(1000 * 7);
  context.response.body = "too late?";
});

router.post("/post", async (context: RouterContext) => {
  if (context.request.hasBody) {
    const { value }: any = await context.request.body();
    const body = await value;
    context.response.body = body;
  } else {
    context.response.body = "";
  }
});

const app = new Application();

// Logger
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  logger.debug(
    `${context.request.method} ${
      decodeURIComponent(
        context.request.url.pathname,
      )
    } - ${String(rt)}`,
  );
});

// Response Time
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Error handler
app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      context.response.status = err.status;
      const { message, status, stack } = err;
      if (context.request.accepts("json")) {
        context.response.body = { message, status, stack };
        context.response.type = "json";
      } else {
        context.response.body = `${status} ${message}\n\n${stack ?? ""}`;
        context.response.type = "text/plain";
      }
    } else {
      logger.error(err);
      throw err;
    }
  }
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// A basic 404 page
app.use(notFound);

app.addEventListener("listen", ({ hostname, port }) => {
  logger.debug("Start listening on " + `${hostname}:${port}`);
});

try {
  await app.listen({ hostname: "localhost", port: 8000 });
} catch (error) {
  logger.error(error);
  Deno.exit(-1);
}
