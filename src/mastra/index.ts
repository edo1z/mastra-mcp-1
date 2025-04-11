import { Mastra } from '@mastra/core';
import { webBrowserAgent } from './agents/web-browser-agent';

export const mastra = new Mastra({
  agents: { webBrowser: webBrowserAgent }
});
