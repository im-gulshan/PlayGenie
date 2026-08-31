import { CustomWorld } from '@core/browser/CustomWorld';
import { PageManager } from '../pages/PageManager';

export interface SauceDemoWorld extends CustomWorld {
  pages: PageManager;
}
