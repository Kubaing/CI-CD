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
                    // สร้าง Docker image โดยใช้ Dockerfile ที่อยู่ใน repository
                    bat "docker build -t dockertest ."
                    
                    // รัน Docker container จาก image ที่สร้าง
                    bat "docker run -d --name projectfrontend -p 54100:3000 dockertest:latest"
                }
            }
        }

        stages {
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
                    // สร้าง Docker image โดยใช้ Dockerfile ที่อยู่ใน repository
                    bat "docker build -t dockertest ."
                    
                    // รัน Docker container จาก image ที่สร้าง
                    bat "docker run -d --name projectbackend -p 54200:3000 dockertest:latest"
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
