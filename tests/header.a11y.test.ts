import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Base from '../src/layouts/Base.astro';

describe('<Header/> within Base layout', () => {
  it('renders a skip link and a main navigation landmark', async () => {
    const container = await AstroContainer.create();

    const result: any = await container.renderToString(Base, {
      props: { title: 'Test' },
      slots: { default: '<div />' },
    });

    const html: string =
      typeof result === 'string'
        ? result
        : (result as { html?: string })?.html ?? String(result);

    // a11y assertions
    expect(html).toContain('href="#main-content"');      // skip link from Base
    expect(html).toMatch(/<nav[^>]+aria-label="Main"/);  // main nav landmark from Header
  });
});
