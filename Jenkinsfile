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

        // Use the standard Playwright browser cache location (0 = use default)
        PLAYWRIGHT_BROWSERS_PATH = '0'

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
                bat 'npx playwright install --with-deps'
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
                    def tagFlag      = params.TAGS ? "-- --tags \"${params.TAGS}\"" : ""
                    def parallelFlag = "-- --parallel ${params.PARALLEL_WORKERS}"

                    // catchError ensures we continue to reporting/archiving even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        echo "Executing: npm run test:${params.PRODUCT} ${tagFlag} ${parallelFlag}"
                        bat "npm run test:${params.PRODUCT} ${tagFlag} ${parallelFlag}"
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                bat 'npm run report'
            }
        }
    }

    post {
        always {
            // Archive the generated HTML report directory
            archiveArtifacts artifacts: 'reports/html-report/**/*', allowEmptyArchive: true

            // Archive failure traces, screenshots, and optional videos
            archiveArtifacts artifacts: 'reports/artifacts/**/*', allowEmptyArchive: true

            // Publish the Cucumber HTML report — requires HTML Publisher plugin
            publishHTML([
                allowMissing:          false,
                alwaysLinkToLastBuild: true,
                keepAll:               true,
                reportDir:             'reports/html-report',
                reportFiles:           'index.html',
                reportName:            'Cucumber Report'
            ])
        }
        failure {
            echo 'Tests encountered failures. Please review the attached Cucumber Report and Playwright Traces.'
        }
    }
}
