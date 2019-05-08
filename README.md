python3 -m venv .
source bin/activate
pip install -r requirements.txt

deactivate


brew update
brew install unixodbc
https://github.com/mkleehammer/pyodbc/wiki

odbcinst -j

brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew update
brew install msodbcsql17 mssql-tools


docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Axity!2019Swd' -e 'MSSQL_PID=Express' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2017-latest-ubuntu
docker run --name mongodb -d -p 27017:27017 mongo