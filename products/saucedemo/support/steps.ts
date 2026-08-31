import { 
  Given as CucumberGiven, 
  When as CucumberWhen, 
  Then as CucumberThen,
  IDefineStepOptions
} from '@cucumber/cucumber';
import { SauceDemoWorld } from './types';

/**
 * Custom wrappers for Cucumber step definitions.
 * This automatically types the `this` context to `SauceDemoWorld`
 * so you don't have to add `this: SauceDemoWorld` to every step.
 */

interface IDefineStepStrong {
  (pattern: RegExp | string, code: (this: SauceDemoWorld, ...args: any[]) => any): void;
  (pattern: RegExp | string, options: IDefineStepOptions, code: (this: SauceDemoWorld, ...args: any[]) => any): void;
}

export const Given: IDefineStepStrong = (...args: any[]) => (CucumberGiven as any)(...args);
export const When: IDefineStepStrong = (...args: any[]) => (CucumberWhen as any)(...args);
export const Then: IDefineStepStrong = (...args: any[]) => (CucumberThen as any)(...args);
