import { CustomWorld } from '@core/browser/CustomWorld';
import { PageManager } from '../pages/PageManager';

export interface SauceDemoSharedState {
  productName?: string;
  firstProdName?: string;
  allProductsName?: string[];
}

export interface SauceDemoWorld extends Omit<CustomWorld, 'sharedData'> {
  pages: PageManager;
  sharedData: SauceDemoSharedState;
}
