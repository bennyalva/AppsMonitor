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


docker run --name mongodb -d -p 27017:27017 mongo