import { CustomWorld } from '@core/browser/CustomWorld';
import { PageManager } from '../pages/PageManager';

export interface PortfolioSharedState {
  activeTab?: string;
  activeSkillCategory?: string;
}

export interface PortfolioWorld extends Omit<CustomWorld, 'sharedData'> {
  pages: PageManager;
  sharedData: PortfolioSharedState;
}
