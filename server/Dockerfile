FROM python:3.12-slim

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ /app/

EXPOSE 8000

CMD ["gunicorn", "CoreRoot.wsgi:application", "--bind", "0.0.0.0:8000"]
