FROM python:3-slim

WORKDIR /home/back-app

COPY ./requirments.txt .

RUN pip install -r requirments.txt

COPY . .

EXPOSE 5000

CMD gunicorn -b 0.0.0.0:5001 app:app