import {
  Given as CucumberGiven,
  When as CucumberWhen,
  Then as CucumberThen,
} from '@cucumber/cucumber';
import { PortfolioWorld } from './types';

/**
 * Custom wrappers for Cucumber step definitions.
 *
 * Automatically types the `this` context to `PortfolioWorld`
 * so you do not have to add `this: PortfolioWorld` to every step.
 *
 * When creating a new product, copy this file and replace
 * `PortfolioWorld` with your product's World interface.
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
    code: (this: PortfolioWorld, ...args: any[]) => void | Promise<void>,
  ): void;
  (
    pattern: string | RegExp,
    options: StepOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (this: PortfolioWorld, ...args: any[]) => void | Promise<void>,
  ): void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Given: TypedStepFn = (...args: any[]) => (CucumberGiven as any)(...args);
export const When: TypedStepFn = (...args: any[]) => (CucumberWhen as any)(...args);
export const Then: TypedStepFn = (...args: any[]) => (CucumberThen as any)(...args);
/* eslint-enable @typescript-eslint/no-explicit-any */
