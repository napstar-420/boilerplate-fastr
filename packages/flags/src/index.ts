import { Config, type ParameterResources } from 'sst/node/config';

export type Flags = {
  [K in keyof ParameterResources as K extends `FLAG_${infer _}` ? K : never]: ParameterResources[K];
};

export function enabled(flag: keyof Flags) {
  return Config[flag] === 'true';
}

export function disabled(flag: keyof Flags) {
  return !enabled(flag);
}
