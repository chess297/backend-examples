import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const CWD = process.cwd();

const YAML_CONFIG_FILENAME = 'configs/config.yaml';

let config: Config;
export interface Config {
  db_url: string;
  mysql_url: string;
  log_on: boolean;
  redis_url: string;
}

export const getConfig = () => {
  config = yaml.load(
    readFileSync(join(CWD, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Config;
  // try {
  //   Joi.assert(
  //     config,
  //     Joi.object({
  //       db_url: Joi.string().required(),
  //       mysql_url: Joi.string().required(),
  //       redis_url: Joi.string().required(),
  //       log_on: Joi.boolean(),
  //       prefix: Joi.string(),
  //       version: Joi.array<string>(),
  //       port: Joi.number(),
  //       jwt: Joi.object({
  //         secret: Joi.string().required(),
  //         expire: Joi.string().required(),
  //       }).required(),
  //     }),
  //     {
  //       allowUnknown: false,
  //     },
  //   );
  // } catch (error) {
  //   if (error instanceof Error) {
  //     throw new Error(`Config validation error: ${error.message}`);
  //   }
  // }
  return config;
};
