import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import helmet from "helmet";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);

  logger.info("Environment Variables:");
  Object.entries(env).forEach(([key, value]) => {
    // Don't log sensitive information like private keys
    if (key.toLowerCase().includes("key") || key.toLowerCase().includes("secret")) {
      logger.info(`\t${key}: [REDACTED]`);
    } else {
      logger.info(`\t${key}: ${value}`);
    }
  });
});

// Add this before your route definitions
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
