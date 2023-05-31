# ПРО ПРОЕКТ

## Функціонал
- реєстрація користувача
- коментарі які користувач може залишати. А також відповідати на них
- сортування та пагінація коментарів
- каптча перед створенням коментаря
- зміна даних користувача - аватар та homepage 
- кешування даних користувача та коментарів
- Відображення новостворених коментарів у реальному часі

## Postman
[Link Here](https://team12345654321.postman.co/workspace/My-Workspace~b7b27dd0-8ecc-4c13-8d49-6af0e090f189/collection/17414321-3617ce99-c276-469e-b639-2c6ea8f58714?action=share&creator=17414321)

## Використані технології
- nodejs/express 
- PostgreSQL - головна БД, Redis - другорядна, для локального кешування 
- Reactjs



# Локальний запуск

1) Клонуйте проєкт

    `git clone https://github.com/SashaVoloshyn/dZENcode_task.git`

2) Перейдіть в папку **server**

`cd server`

3) Додайте файл `.env` із секретними ключами в папку server

4) Запустіть docker а потім введіть відповідну команду: `docker-compose up --build`


5) Перейдіть у папку **../client**: `cd ../client;`

6) Запустіть фронтенд:
    - через npm:`npm install;npm start`

    - через docker: `docker build -t my-react-app .;docker run -p 3000:3000 my-react-app`

