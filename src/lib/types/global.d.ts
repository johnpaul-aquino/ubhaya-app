declare module 'jest-axe' {
  import { ElementHandle } from 'puppeteer';

  export interface AxeResults {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
  }

  export function axe(
    element: Element | ElementHandle | string,
    options?: any
  ): Promise<AxeResults>;

  export function toHaveNoViolations(received: AxeResults): {
    message: () => string;
    pass: boolean;
  };

  export const configure: (configuration: any) => void;
}

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}