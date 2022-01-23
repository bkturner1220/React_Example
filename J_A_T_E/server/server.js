const express = require('express');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const Integrations = require("@sentry/tracing");

const app = express();
const PORT = process.env.PORT || 3000;
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes/htmlRoutes')(app);

Sentry.init({
    dsn: "https://ce08af044ebb4e7a8e942b46c9969e5b@o1120953.ingest.sentry.io/6157534",
    integrations: [new Integrations.BrowserTracing()],
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
