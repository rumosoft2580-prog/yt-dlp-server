FROM python:3.11-slim

RUN apt-get update && apt-get install -y ffmpeg

RUN pip install --no-cache-dir yt-dlp

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3000

CMD ["python", "-m", "yt_dlp", "--version"]