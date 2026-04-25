import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

/** Absolute file:// URL of the built lazy-kitchen.html viewer. */
export const VIEWER_URL = pathToFileURL(join(process.cwd(), 'lazy-kitchen.html')).toString();
