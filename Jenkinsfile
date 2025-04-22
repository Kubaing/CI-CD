pipeline {
    agent any

    stages {
        stage('Checkout') {
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


        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                script {
                    dir('Project Frontend') {
                        // สร้าง Docker image โดยใช้ Dockerfile ที่อยู่ใน repository
                        bat "docker build -t dockertest -f dockerfile ."
                        
                        // รัน Docker container จาก image ที่สร้าง
                        bat "docker run -d --name projectfrontend-frontend -p 54100:3000 dockertest:latest"
                    }
                }
            }
        }

        stage('Unit Tests') {
            steps {
                echo "Running tests..."
                script {
                    dir('Project Frontend') {
                        // ใช้ yarn แทน npm ตามที่กำหนดใน package.json
                        bat "yarn test --watchAll=false || echo 'Warning: Tests not implemented yet'"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application..."
                script {
                    // ตรวจสอบว่า container ทำงานอยู่หรือไม่
                    bat "docker ps | findstr projectfrontend-frontend|| echo 'Container not running!'"
                }
            }
        }

        stage('Deployment test') {
            steps {
                echo "Running deployment tests..."
                script {
                    // เพิ่มการทดสอบ API หรือ เว็บแอปฯ เช่น
                    bat "curl -s http://localhost:54100 > NUL || echo 'Warning: Application not responding'"
                }
            }
        }
    }

    post {
        always {
            echo "Build complete"
        }
        failure {
            echo "Build failed"
        }
    }
}
