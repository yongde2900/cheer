import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  API_PREFIX: get("API_PREFIX").required().asString(),
  NODE_ENV: get('NODE_ENV').required().asString(),
}
