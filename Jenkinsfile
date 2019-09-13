pipeline {
    agent any
    environment {
        IMAGE_VERSION = '0.0.1'
    }
    stages {
        stage('Build Frontend Web') {
            steps {
                echo 'Building Frontend Angular'
                dir ('front/'){
                    sh 'npm ci'
                    sh 'npm run build-beta'
                }
            }
        }
        stage('Docker up') {
            steps {
                echo 'Running on Docker'
                sh 'docker network disconnect pharmacymonitoringdev_default mongodbdev'
                sh 'docker-compose down --rmi all'
                sh 'docker-compose up -d'
                sh 'docker network connect pharmacymonitoringdev_default mongodbdev'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
        success {
            echo 'I succeeeded!'
        }
        unstable {
            echo 'I am unstable :/'
            sh 'docker-compose down --rmi all'
        }
        failure {
            echo 'I failed :('
            sh 'docker-compose down --rmi all'
        }
        changed {
            echo 'Things were different before...'
        }
    }
}
