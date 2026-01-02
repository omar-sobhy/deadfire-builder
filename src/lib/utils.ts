import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import chalk from 'chalk';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export enum LogLevel {
  Trace = -1,
  Info = 0,
  Log,
  Warn,
  Error,
}

export type LogLevelString = 'trace' | 'info' | 'log' | 'warn' | 'error';

export class Logger {
  private level: LogLevel;

  private static instance?: Logger;

  private static parseLogLevel(level: LogLevelString) {
    if (level === 'trace') return LogLevel.Trace;
    if (level === 'info') return LogLevel.Info;
    if (level === 'log') return LogLevel.Log;
    if (level === 'warn') return LogLevel.Warn;
    return LogLevel.Error;
  }

  private constructor(level: LogLevelString) {
    this.level = Logger.parseLogLevel(level);
  }

  trace(s: string) {
    if (this.level < 0) console.info(chalk.cyanBright(s));
  }

  info(s: string) {
    if (this.level < 1) console.info(chalk.blue(s));
  }

  log(s: string) {
    if (this.level < 2) console.log(chalk.white(s));
  }

  warn(s: string) {
    if (this.level < 3) console.warn(chalk.yellow(s));
  }

  error(s: string) {
    if (this.level < 4) console.error(chalk.red(s));
  }

  public static getInstance(opts?: { level: LogLevelString }) {
    if (!this.instance) {
      this.instance = new Logger(opts?.level ?? 'info');
    }

    if (opts?.level) {
      this.instance.level = Logger.parseLogLevel(opts.level);
    }

    return this.instance;
  }
}

export function stripTags(input: string): string {
  return input.replaceAll(/<[^>]*>/g, '');
}

export async function dereference<M, K extends keyof M, O, ReturnValue extends M[K]>(
  model: M,
  key: K,
  getter: (opts: O | object) => Promise<ReturnValue>,
  opts?: O,
): Promise<M[K] | Awaited<ReturnValue> | undefined> {
  if (model[key] === null) {
    return undefined;
  }

  if (model[key] !== undefined) {
    return model[key];
  }

  return await getter.bind(model)(opts || {});
}
