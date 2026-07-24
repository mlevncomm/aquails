#!/usr/bin/env node
/**
 * Thin wrapper: product unit checks now live in Vitest (src/services/productHelpers.test.ts).
 * Kept so `npm run test:product` remains CI-compatible.
 */
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['vitest', 'run', 'src/services/productHelpers.test.ts'], {
  stdio: 'inherit',
  shell: true,
});
process.exit(result.status ?? 1);
