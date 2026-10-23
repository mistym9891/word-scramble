// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (rel) => readFileSync(resolve(root, rel), 'utf8');

describe('index.html metadata', () => {
  const html = read('index.html');

  it('has Open Graph title and description', () => {
    expect(html).toMatch(/<meta[^>]+property="og:title"/);
    expect(html).toMatch(/<meta[^>]+property="og:description"/);
  });

  it('has Twitter title and description', () => {
    expect(html).toMatch(/<meta[^>]+name="twitter:title"/);
    expect(html).toMatch(/<meta[^>]+name="twitter:description"/);
  });

  it('links the manifest and icon', () => {
    expect(html).toMatch(/<link[^>]+rel="manifest"[^>]+href="\/manifest\.webmanifest"/);
    expect(html).toMatch(/<link[^>]+rel="icon"[^>]+href="\/icon\.svg"/);
  });
});

describe('public/manifest.webmanifest', () => {
  it('is valid JSON with name, icons and start_url', () => {
    const manifest = JSON.parse(read('public/manifest.webmanifest'));
    expect(manifest.name).toBe('Word Scramble');
    expect(manifest.start_url).toBe('.');
    expect(manifest.display).toBe('standalone');
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('references icon files that exist in public/', () => {
    const manifest = JSON.parse(read('public/manifest.webmanifest'));
    for (const icon of manifest.icons) {
      expect(existsSync(resolve(root, 'public', icon.src))).toBe(true);
    }
  });
});

describe('public/robots.txt', () => {
  it('exists and allows crawling', () => {
    expect(read('public/robots.txt')).toMatch(/User-agent: \*/);
  });
});
