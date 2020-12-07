/*
 * This is an example of a server that utilizes the router.
 */

import {
    bold,
    cyan,
    green,
    yellow,
  } from "https://deno.land/std@0.77.0/fmt/colors.ts";

  import {
    Application,
    Context,
    isHttpError,
    Router,
    RouterContext,
    Status,
  }  from "https://deno.land/x/oak@v6.3.2/mod.ts";

import { logger } from "./logger.ts";

  interface Book {
    id: string;
    title: string;
    author: string;
  }

  const books = new Map<string, Book>();

  books.set("1234", {
    id: "1234",
    title: "The Hound of the Baskervilles",
    author: "Conan Doyle, Author",
  });

  function notFound(context: Context) {
    context.response.status = Status.NotFound;
    context.response.body =
      `<html><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
  }

  const router = new Router();
  router
    .get("/", (context: RouterContext) => {
      context.response.body = "Hello world!";
    })

    // .post("/book", async (context: RouterContext) => {

    // })
    .get<{ id: string }>("/book/:id",  (context, next) => {
      if (context.params && books.has(context.params.id)) {
        context.response.body = books.get(context.params.id);
      } else {
        return notFound(context);
      }
    });

  const app = new Application();

  // Logger
  app.use(async (context: RouterContext, next: Function) => {
    await next();
    const rt = context.response.headers.get("X-Response-Time");
    logger.debug(
      `${green(context.request.method)} ${
        cyan(decodeURIComponent(context.request.url.pathname))
      } - ${
        bold(
          String(rt),
        )
      }`,
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
    logger.debug(
      bold("Start listening on ") + yellow(`${hostname}:${port}`),
    );
  });

  await app.listen({ hostname: "127.0.0.1", port: 8000 });
  logger.debug(bold("Finished."));