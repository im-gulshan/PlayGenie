import {
  Given as CucumberGiven,
  When as CucumberWhen,
  Then as CucumberThen,
} from '@cucumber/cucumber';
import { SauceDemoWorld } from './types';

/**
 * Custom wrappers for Cucumber step definitions.
 *
 * Automatically types the `this` context to `SauceDemoWorld`
 * so you don't have to add `this: SauceDemoWorld` to every step.
 *
 * When creating a new product, copy this file and replace
 * `SauceDemoWorld` with your product's World interface.
 */

/** Step definition options (timeout, tags, etc.) */
interface StepOptions {
  timeout?: number;
  wrapperOptions?: Record<string, unknown>;
}

/** Strongly-typed step definition function signature */
interface TypedStepFn {
  (
    pattern: string | RegExp,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (this: SauceDemoWorld, ...args: any[]) => void | Promise<void>,
  ): void;
  (
    pattern: string | RegExp,
    options: StepOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (this: SauceDemoWorld, ...args: any[]) => void | Promise<void>,
  ): void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Given: TypedStepFn = (...args: any[]) => (CucumberGiven as any)(...args);
export const When: TypedStepFn = (...args: any[]) => (CucumberWhen as any)(...args);
export const Then: TypedStepFn = (...args: any[]) => (CucumberThen as any)(...args);
/* eslint-enable @typescript-eslint/no-explicit-any */
