FROM python:3.7

WORKDIR /app

COPY ./app/requirements.txt /app

RUN pip install -r /app/requirements.txt

COPY ./app /app

ENV PYTHONPATH=/app

RUN almebic upgrade head

EXPOSE 8000

CMD [ "uvicorn", "app.main:app" ]
