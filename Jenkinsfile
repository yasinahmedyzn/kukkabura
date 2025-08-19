pipeline {
    agent any

    environment {
        // Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-creds')

        // Docker image names
        FRONTEND_IMAGE = 'yasin2022/kukkabura:frontend'
        BACKEND_IMAGE = 'yasin2022/kukkabura:backend'

        // Frontend environment variable (API URL)
        VITE_API_URL = 'https://kukkabura-backend.koyeb.app'

        // Koyeb API key credential
        KOYEB_API_KEY = credentials('koyeb-api-key')

        // Koyeb app/service name
        KOYEB_APP = 'kukkabura-backend'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/yasinahmedyzn/kukkabura.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build frontend image with VITE_API_URL as build arg
                sh """
                    docker build --build-arg VITE_API_URL=$VITE_API_URL -t $FRONTEND_IMAGE ./frontend
                """
                // Build backend image
                sh 'docker build -t $BACKEND_IMAGE ./backend'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh 'docker push $FRONTEND_IMAGE'
                sh 'docker push $BACKEND_IMAGE'
            }
        }

        stage('Deploy Backend to Koyeb') {
            steps {
                // Install Koyeb CLI if not installed
                sh 'curl -s https://cli.koyeb.com/install.sh | sh'

                // Login to Koyeb CLI
                sh 'koyeb login --api-token $KOYEB_API_KEY'

                // Update backend service with new Docker image
                sh """
                    koyeb service update $KOYEB_APP \
                    --image $BACKEND_IMAGE \
                    --env VITE_API_URL=$VITE_API_URL
                """
            }
        }
    }

    post {
        always {
            // Logout from Docker Hub
            sh 'docker logout'
        }
    }
}
