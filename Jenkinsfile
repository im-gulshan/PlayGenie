pipeline {
    agent any

    // Tell Jenkins to use the Node.js installation named "NodeJS-20"
    // Configure this name in: Manage Jenkins -> Tools -> NodeJS installations
    tools {
        nodejs 'NodeJS-20'
    }

    parameters {
        choice(name: 'PRODUCT', choices: ['saucedemo'], description: 'Select the product to execute')
        choice(name: 'TEST_ENV', choices: ['qa', 'uat', 'dev'], description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run tests on')
        booleanParam(name: 'HEADLESS', defaultValue: true, description: 'Run in headless mode')
        string(name: 'TAGS', defaultValue: '', description: 'Cucumber tags to execute (e.g. @smoke, leave empty for all)')
        string(name: 'PARALLEL_WORKERS', defaultValue: '2', description: 'Number of parallel workers')
        booleanParam(name: 'RECORD_VIDEO', defaultValue: false, description: 'Record video of tests')
    }

    environment {
        // Map Jenkins parameters directly to the environment variables our framework expects
        TEST_ENV     = "${params.TEST_ENV}"
        BROWSER      = "${params.BROWSER}"
        HEADLESS     = "${params.HEADLESS}"
        RECORD_VIDEO = "${params.RECORD_VIDEO}"

        // Persistent browser cache outside the workspace.
        // Browsers survive npm ci (which wipes node_modules/) and are reused across builds.
        // playwright install skips the download if the browser version already exists here.
        PLAYWRIGHT_BROWSERS_PATH = 'C:\\ProgramData\\playwright-browsers'

        // SauceDemo credentials — stored as Jenkins Secret Text credentials
        // Add these in: Manage Jenkins -> Credentials -> Global -> Add Credentials (Secret text)
        SAUCE_USERNAME = credentials('sauce-username')
        SAUCE_PASSWORD = credentials('sauce-password')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install node modules and Playwright browsers with system dependencies
                bat 'npm ci --legacy-peer-deps'
                // Install only the browser selected for this build — skips download if already cached.
                bat "npx playwright install --with-deps ${params.BROWSER}"
            }
        }

        stage('Lint') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat 'npm run lint'
                }
            }
        }

        stage('Generate Auth State') {
            steps {
                script {
                    // Generate auth storage state to skip repetitive UI logins
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        bat "npm run auth:${params.PRODUCT}"
                    }
                }
            }
        }

        stage('Execute UI Tests') {
            steps {
                script {
                    // Bug #4 fix: call npx cucumber-js directly to bypass npm's argument
                    // interception on Windows. Using `npm run -- --parallel` causes npm to
                    // consume --parallel as its own config flag before passing args to cucumber.
                    def tagArg      = params.TAGS ? "--tags \"${params.TAGS}\"" : ""
                    def cucumberCmd = "npx cucumber-js -p ${params.PRODUCT} --parallel ${params.PARALLEL_WORKERS} ${tagArg}".trim()

                    // catchError ensures we continue to reporting/archiving even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        echo "Executing: ${cucumberCmd}"
                        bat cucumberCmd
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                // catchError so a missing JSON report does not block Publish Reports
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    bat 'npm run report'
                }
            }
        }

        stage('Publish Reports') {
            steps {
                // archiveArtifacts and publishHTML are workspace steps — they must live
                // inside a stage, not in post{}. Declarative Pipeline post{} runs outside
                // the workspace context and does not support file-system steps.
                archiveArtifacts artifacts: 'reports/html-report/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'reports/artifacts/**/*',   allowEmptyArchive: true

                // Requires HTML Publisher plugin.
                // allowMissing: true guards against reports/ being absent on a fresh checkout
                // (reports/ is in .gitignore and is only created at runtime).
                publishHTML([
                    allowMissing:          true,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             'reports/html-report',
                    reportFiles:           'index.html',
                    reportName:            'Cucumber Report'
                ])
            }
        }
    }

    post {
        // post{} is for notifications only — not file-system operations.
        // File-system steps (archiveArtifacts, publishHTML) have been moved
        // to the Publish Reports stage above where workspace context is guaranteed.
        failure {
            echo 'Tests encountered failures. Please review the attached Cucumber Report and Playwright Traces.'
        }
    }
}
