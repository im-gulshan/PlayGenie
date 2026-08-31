import {
  Given as CucumberGiven,
  When as CucumberWhen,
  Then as CucumberThen,
  IDefineStepOptions,
} from '@cucumber/cucumber';
import { SauceDemoWorld } from './types';

/**
 * Custom wrappers for Cucumber step definitions.
 * This automatically types the `this` context to `SauceDemoWorld`
 * so you don't have to add `this: SauceDemoWorld` to every step.
 */

interface IDefineStepStrong {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pattern: RegExp | string, code: (this: SauceDemoWorld, ...args: any[]) => any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (
    pattern: RegExp | string,
    options: IDefineStepOptions,
    code: (this: SauceDemoWorld, ...args: any[]) => any,
  ): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Given: IDefineStepStrong = (...args: any[]) => (CucumberGiven as any)(...args); // eslint-disable-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const When: IDefineStepStrong = (...args: any[]) => (CucumberWhen as any)(...args); // eslint-disable-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Then: IDefineStepStrong = (...args: any[]) => (CucumberThen as any)(...args); // eslint-disable-line @typescript-eslint/no-explicit-any
