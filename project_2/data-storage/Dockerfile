FROM python:3-slim

WORKDIR /home/back-app

COPY ./requirments.txt .

RUN pip install -r requirments.txt

COPY . .

EXPOSE 5001

CMD gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app -b 0.0.0.0:5001