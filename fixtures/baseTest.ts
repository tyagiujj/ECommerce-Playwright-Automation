import { test as base } from '@playwright/test';

// Google ad servers. Their ads (full-screen vignette, injected chips) block clicks and change page text.
const AD_HOSTS = /googlesyndication|doubleclick\.net|googleadservices|adservice\.google|fundingchoicesmessages/;

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(AD_HOSTS, route => route.abort());
    await use(context);
  },
});

export { expect } from '@playwright/test';
