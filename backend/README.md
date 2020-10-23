# Face Authorization backend part


## How to run

First create virtualenv.

`virtualenv env`

Activate environment.

`. env/bin/activate`

Install all dependency by running

`pip install -r app/requirements.txt`

Export environment variables:

```
export PYTHONPATH=${PYTHONPATH}:./app
export POSTGRES_SERVER="<postgresql server>"
export POSTGRES_USER="<your db username>"
export POSTGRES_PASSWORD="<your db password>"
export POSTGRES_DB="<your db name>"

```

Run server

`uvicorn main.app:main`
