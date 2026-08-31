declare module 'multiple-cucumber-html-reporter' {
  interface ReportMetadata {
    browser?: {
      name: string;
      version: string;
    };
    device?: string;
    platform?: {
      name: string;
      version: string;
    };
  }

  interface CustomDataItem {
    label: string;
    value: string;
  }

  interface ReportOptions {
    jsonDir: string;
    reportPath: string;
    metadata?: ReportMetadata;
    customData?: {
      title: string;
      data: CustomDataItem[];
    };
    openReportInBrowser?: boolean;
    disableLog?: boolean;
    displayDuration?: boolean;
    displayReportTime?: boolean;
    pageTitle?: string;
    reportName?: string;
    pageFooter?: string;
  }

  export function generate(options: ReportOptions): void;
}
