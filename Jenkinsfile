pipeline {
  agent any

  environment {
    // Docker Hub credentials (from Jenkins credentials)
    DOCKERHUB_CREDENTIALS = credentials('docker-hub-creds')

    // Image names
    FRONTEND_IMAGE = 'yasin2022/kukkabura:frontend'
    BACKEND_IMAGE = 'yasin2022/kukkabura:backend'

    // Frontend environment variables (passed into Docker build)
    VITE_API_URL = 'https://kukkabura-backend.onrender.com'
    // Add more VITE_* variables here if needed
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/yasinahmedyzn/kukkabura.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        // Build frontend image with VITE_API_URL build-arg
        sh """
          docker build \
            --build-arg VITE_API_URL=$VITE_API_URL \
            -t $FRONTEND_IMAGE ./frontend
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
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
