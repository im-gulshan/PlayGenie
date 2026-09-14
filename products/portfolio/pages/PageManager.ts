import { Page } from '@playwright/test';
import { Logger } from '@core/utils/logger';
import { NavigationPage } from './NavigationPage';
import { HeroPage } from './HeroPage';
import { ExperiencePage } from './ExperiencePage';
import { SkillsPage } from './SkillsPage';
import { ProjectsPage } from './ProjectsPage';
import { InnovationsPage } from './InnovationsPage';
import { EducationPage } from './EducationPage';
import { ContactPage } from './ContactPage';

/**
 * PageManager provides centralized access to all Portfolio page objects.
 *
 * Instantiated once per scenario via the product-level Before hook.
 * All step files access pages via `this.pages.<pageName>` — no helper function needed.
 *
 * When adding a new page:
 * 1. Create the page class extending BasePage
 * 2. Import and register it here
 */
export class PageManager {
  readonly navigationPage: NavigationPage;
  readonly heroPage: HeroPage;
  readonly experiencePage: ExperiencePage;
  readonly skillsPage: SkillsPage;
  readonly projectsPage: ProjectsPage;
  readonly innovationsPage: InnovationsPage;
  readonly educationPage: EducationPage;
  readonly contactPage: ContactPage;

  constructor(
    public readonly page: Page,
    private readonly logger: Logger,
  ) {
    this.navigationPage = new NavigationPage(this.page, this.logger);
    this.heroPage = new HeroPage(this.page, this.logger);
    this.experiencePage = new ExperiencePage(this.page, this.logger);
    this.skillsPage = new SkillsPage(this.page, this.logger);
    this.projectsPage = new ProjectsPage(this.page, this.logger);
    this.innovationsPage = new InnovationsPage(this.page, this.logger);
    this.educationPage = new EducationPage(this.page, this.logger);
    this.contactPage = new ContactPage(this.page, this.logger);
  }
}
