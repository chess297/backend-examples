import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import Joi from 'joi';
const CWD = process.cwd();

const YAML_CONFIG_FILENAME =
  process.env['NODE_ENV'] === 'production'
    ? 'configs/config.yaml'
    : 'configs/config.dev.yaml';
let config: Config;
export interface Config {
  db_url: string;
  redis_url: string;
}
export default () => {
  config = yaml.load(
    readFileSync(join(CWD, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Config;
  try {
    Joi.assert(
      config,
      Joi.object({
        db_url: Joi.string().required(),
        mysql_url: Joi.string().required(),
        redis_url: Joi.string().required(),
        log_on: Joi.boolean(),
        prefix: Joi.string(),
        version: Joi.array<string>(),
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }
  return config;
};
