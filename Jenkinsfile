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

        stage('Build Frontend Image') {
            steps {
                echo "Building Docker image..."
                script {
                    bat "docker build -t frontend-image ."
                    bat "docker run -d --name projectfrontend -p 54100:3000 frontend-image"
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

        stage('Build Backend Image') {
            steps {
                echo "Building Docker image..."
                script {
                    bat "docker build -t backend-image ."
                    bat "docker run -d --name projectbackend -p 54200:3000 backend-image"
                }
            }
        }

        stage('Unit Tests') {
            steps {
                echo "Running tests..."
                // เพิ่มคำสั่งรัน Unit Test ถ้ามี
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application..."
                // เพิ่มคำสั่ง deploy ได้เลย
            }
        }

        stage('Deployment test') {
            steps {
                echo "Running tests..."
                // เพิ่มคำสั่งสำหรับ test การ deploy ได้เลย
            }
        }
    }
}
