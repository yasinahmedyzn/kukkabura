pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker-hub-creds')
    FRONTEND_IMAGE = 'yasin2022/kukkabura:frontend'
    BACKEND_IMAGE = 'yasin2022/kukkabura:backend'
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/yasinahmedyzn/kukkabura.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
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
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
