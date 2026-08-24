pipeline {
    agent any

    parameters {
        choice(name: 'PRODUCT', choices: ['productA', 'productB'], description: 'Select the product to execute')
        choice(name: 'TEST_ENV', choices: ['qa', 'uat', 'dev'], description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run tests on')
        booleanParam(name: 'HEADLESS', defaultValue: true, description: 'Run in headless mode')
        string(name: 'TAGS', defaultValue: '', description: 'Cucumber tags to execute (e.g. @smoke, leave empty for all)')
        string(name: 'PARALLEL_WORKERS', defaultValue: '2', description: 'Number of parallel workers')
        booleanParam(name: 'RECORD_VIDEO', defaultValue: false, description: 'Record video of tests')
    }

    environment {
        // Map Jenkins parameters directly to the environment variables our framework expects
        TEST_ENV = "${params.TEST_ENV}"
        BROWSER = "${params.BROWSER}"
        HEADLESS = "${params.HEADLESS}"
        RECORD_VIDEO = "${params.RECORD_VIDEO}"
        
        // Example of secure credentials mapping
        // ADMIN_PASSWORD = credentials('productA-admin-password')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install node modules and Playwright system dependencies
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute UI Tests') {
            steps {
                script {
                    def tagFlag = params.TAGS ? "-- --tags \"${params.TAGS}\"" : ""
                    def parallelFlag = "-- --parallel ${params.PARALLEL_WORKERS}"
                    
                    // catchError ensures we continue to reporting/archiving even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        echo "Executing: npm run test:${params.PRODUCT} ${tagFlag} ${parallelFlag}"
                        sh "npm run test:${params.PRODUCT} ${tagFlag} ${parallelFlag}"
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                sh 'npm run report'
            }
        }
    }

    post {
        always {
            // Archive the generated Cucumber HTML report
            archiveArtifacts artifacts: 'reports/cucumber-report.html', allowEmptyArchive: true
            
            // Archive failure traces, screenshots, and optional videos
            archiveArtifacts artifacts: 'reports/artifacts/**/*', allowEmptyArchive: true
            
            // If the Jenkins HTML Publisher plugin is installed:
            /*
            publishHTML([
                allowMissing: false, 
                alwaysLinkToLastBuild: true, 
                keepAll: true, 
                reportDir: 'reports', 
                reportFiles: 'cucumber-report.html', 
                reportName: 'Cucumber Report'
            ])
            */
        }
        failure {
            echo "Tests encountered failures. Please review the attached Cucumber Report and Playwright Traces."
        }
    }
}
