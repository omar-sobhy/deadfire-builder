import chalk from 'chalk';

export function log(s: string) {
  console.log(chalk.white(s));
}

export function info(s: string) {
  console.info(chalk.blue(s));
}

export function warn(s: string) {
  console.warn(chalk.yellow(s));
}

export function error(s: string) {
  console.error(chalk.red(s));
}
