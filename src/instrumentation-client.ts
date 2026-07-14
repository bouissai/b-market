"use client";

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e04393effaac3cb0c99cba77a33f6efe@o4509031582138368.ingest.de.sentry.io/4509031583711312",
  tracesSampleRate: 0.1,
  debug: false,
});

/**
 * Required by @sentry/nextjs (Turbopack / App Router)
 * Instrumente les navigations client (route changes).
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
