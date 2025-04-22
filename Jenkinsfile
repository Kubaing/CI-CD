pipeline {
    agent any

    stages {
        stage('Checkout Frontend') {
            steps {
                echo "Clone Code the project From Git"
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        credentialsId: 'Boblee',
                        url: 'https://github.com/Kubaing/CI-CD.git'
                    ]]
                ])
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building Docker image..."
                script {
                    bat "docker build -t frontend ."
                    bat "docker run -d --name projectfrontend -p 54100:3000 frontend"
                }
            }
        }

          stage('Checkout Backend') {
            steps {
                echo "Clone Code the project From Git"
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        credentialsId: 'Boblee',
                        url: 'https://github.com/Kubaing/CI-CD-BK.git'
                    ]]
                ])
            }
        }

        stage('Build Backend') {
            steps {
                echo "Building Docker image..."
                script {
                    bat "docker build -t backend ."
                    bat "docker run -d --name projectbackend -p 54200:9000 backend"
                }
            }
        }

          stage('Unit Tests') {
            steps {
                echo "Running tests..."
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application..."
            }
        }

        stage('Deployment test') {
            steps {
                echo "Running tests..."
            }
        }
    }
}
