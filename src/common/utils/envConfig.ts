import dotenv from "dotenv";
import { bool, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ default: 60000 }),
  PRIVATE_KEY: str({ default: "" }),
  CONTRACT_ENVIRONMENT: str({ default: "localhardhat" }),
  PRIVY_APP_ID: str({ default: "" }),
  PRIVY_JWT_VERIFICATION_KEY: str({ default: "" }),
  DISABLE_JWT_AUTH: bool({ default: false }),
});
