pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = "ripmyloven/movie-express-app"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Получение кода...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Сборка Docker образа...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Запуск тестов...'
                sh "docker run --rm ${DOCKER_IMAGE}:${DOCKER_TAG} npm test"
            }
        }
        
        stage('Docker Login') {
            steps {
                echo 'Авторизация в Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Отправка образа в Docker Hub...'
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Запуск контейнера...'
                // Останавливаем предыдущий контейнер, если он существует
                sh "docker rm -f movie-app-container || true"
                // Запускаем новый контейнер
                sh "docker run -d -p 3000:3000 --name movie-app-container ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Verify Application') {
            steps {
                echo 'Проверка работы приложения...'
                // Даем приложению время на запуск
                sh 'sleep 5'
                // Проверяем доступность приложения
                sh 'curl http://localhost:3000 || exit 1'
            }
        }
    }
    
    post {
        always {
            echo 'Очистка...'
            sh 'docker logout'
        }
    }
}
