export PYTHONPATH=${PYTHONPATH}:./app
export SQLITE_DB="./sql_app.db"

uvicorn app.main:app
