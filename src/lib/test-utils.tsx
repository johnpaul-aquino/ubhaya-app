import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Test wrapper with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Accessibility testing helper
export const testA11y = async (component: ReactElement) => {
  const { container } = customRender(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
};

// Mock data generators for testing
export const mockPageData = {
  id: '1',
  slug: 'test-page',
  title: 'Test Page',
  content: 'This is test content',
  seo: {
    title: 'Test Page - SEO Title',
    description: 'This is a test page description for SEO',
    keywords: 'test, page, seo',
    canonical: 'https://example.com/test-page',
    image: {
      url: 'https://example.com/test-image.jpg',
      alt: 'Test image',
    },
  },
  publishedAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockBlogPost = {
  id: '1',
  slug: 'test-blog-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test blog post excerpt',
  content: 'This is test blog post content',
  author: {
    id: '1',
    name: 'Test Author',
    email: 'author@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test author bio',
  },
  categories: [
    {
      id: '1',
      name: 'Technology',
      slug: 'technology',
      description: 'Technology category',
    },
  ],
  tags: ['testing', 'jest', 'react'],
  seo: {
    title: 'Test Blog Post - SEO Title',
    description: 'This is a test blog post description for SEO',
    keywords: 'test, blog, post, seo',
    canonical: 'https://example.com/blog/test-blog-post',
    image: {
      url: 'https://example.com/test-blog-image.jpg',
      alt: 'Test blog image',
    },
  },
  publishedAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockSiteConfig = {
  name: 'Test Site',
  description: 'Test site description',
  url: 'https://example.com',
  ogImage: 'https://example.com/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/example',
    github: 'https://github.com/example',
  },
  author: {
    name: 'Test Author',
    email: 'author@example.com',
    twitter: '@example',
  },
};

// Component testing helpers
export const createMockProps = (overrides = {}) => ({
  ...overrides,
});

// Form testing helpers
export const fillForm = async (
  getByLabelText: any,
  userEvent: any,
  formData: Record<string, string>
) => {
  for (const [label, value] of Object.entries(formData)) {
    const input = getByLabelText(label);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  }
};

// Async testing helpers
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export custom render as the default render
export { customRender as render };