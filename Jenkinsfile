pipeline {
  agent any

  environment {
    // Docker Hub login
    DOCKERHUB_CREDENTIALS = credentials('docker-hub-creds')

    // Image names
    FRONTEND_IMAGE = 'yasin2022/kukkabura:frontend'
    BACKEND_IMAGE = 'yasin2022/kukkabura:backend'

    // Frontend environment variables (from Jenkins, not .env file)
    // These must be set in Jenkins job configuration
    VITE_API_URL = 'https://kukkabura-backend.onrender.com'
    //add more .env
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/yasinahmedyzn/kukkabura.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        // Pass VITE_* variables into frontend Docker build
        sh """
          docker build \
            --build-arg VITE_API_URL=$VITE_API_URL \
            -t $FRONTEND_IMAGE ./frontend
        """
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

    stage('Trigger Render Deploy') {
      steps {
        sh 'curl -X POST https://api.render.com/deploy/srv-d2a9fq3uibrs73c1pn2g?key=hV_LqL3kDeM'
        sh 'curl -X POST https://api.render.com/deploy/srv-d2a9a7juibrs73c1jfmg?key=R9nRtFWiclo'
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
