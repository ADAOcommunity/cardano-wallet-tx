// source: https://jestjs.io/docs/code-transformation#examples

import { basename } from 'path'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const process = (filename) => {
  return 'module.exports = ' + JSON.stringify(basename(filename)) + ';'
}
