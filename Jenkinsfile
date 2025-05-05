pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "movie-express-app"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "movie-app-container"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching code...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    try {
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                        sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                    } catch (Exception e) {
                        echo "Error building Docker image: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                script {
                    try {
                        sh "docker run --rm ${DOCKER_IMAGE}:${DOCKER_TAG} npm test"
                    } catch (Exception e) {
                        echo "Tests failed: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Starting container...'
                script {
                    try {
                        sh "docker rm -f ${CONTAINER_NAME} || true"
                        sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    } catch (Exception e) {
                        echo "Error starting container: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Verify Application') {
            steps {
                echo 'Verifying application...'
                script {
                    try {
                        sh 'sleep 5'
                        sh 'curl http://localhost:3000'
                    } catch (Exception e) {
                        echo "Application verification failed: ${e.message}"
                        throw e
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker resources...'
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
            
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            sh "docker rmi ${DOCKER_IMAGE}:latest || true"
            
            sh "docker image prune -f || true"
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
