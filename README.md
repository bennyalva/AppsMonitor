# Monitor de Aplicaciones

## Synopsis

Desarrollo en [Python3](https://www.python.org/download/releases/3.0/) y [Angular7](https://angular.io/) para el monitoreo de aplicativos web, bases de datos relacionales y servicios web mediante la consulta se sitios con webscrapping, conexiones odbc y consultas TCP.  

## Motivation

Se requiere de un monitoreo no intrusivo que no dependa de agentes instalados en los servidores a monitorear y que valide a travez de la red que los accesos se encuentren funcionando de manera correcta.  

Se requiere tener un historial del estado de salud de los aplicativos y flexibilidad para dar de alta y baja los aplicativos necesarios.

## Editores y extensiones

Se recomienda el uso de [Visual Studio Code](https://code.visualstudio.com/) aunque se puede trabajar con el editor de su preferencia.  
La extensión [ms-python](https://github.com/Microsoft/vscode-python) es de gran utilidad en la ejecución del proyecto.  

## Installation

### Python

[Python3](https://www.python.org/downloads/)  

Instalar el driver de SQL Server en MacOS  

```Shell
brew update  
brew install unixodbc  
https://github.com/mkleehammer/pyodbc/wiki  

odbcinst -j //Verifica las rutas de los repositorios  

brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release  
brew update  
brew install msodbcsql17 mssql-tools  
```

### Angular

[Angular CLI](https://github.com/angular/angular-cli)  

## Para arrancar el proyecto

En el directorio donde se descarga el repositorio ejecutar:

### Python

```Python
cd service_python  
python3 -m venv .  
source bin/activate  
pip3 install -r requirements.txt  
```
`python3 init.py` inicia el proyecto Python

Para salir de ambiente ejecutar: `deactivate`

### Angular

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Infraestructura
 
 ```Shell
//Levantar bd MongoDb
docker run --name mongodb -d -p 27017:27017 mongo  

//Levantar bd SqlServer (pruebas)
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=SecurePwd' -e 'MSSQL_PID=Express' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2017-latest-ubuntu  
 ```

# Objetos 

Objeto para registrar un aplicativo  
```json
{
	"application": "Aplicativo",
	"description": "Aplicativo System",
	"ownerEmail": ["francisco.rodriguez@axity.com"],
	"sites": [
		{ 
			"name": "Google",
			"url": "http://Google.com/",
			"type": "principal",
			"environment": "Prod"
		}
	],
	"databases": [
		{
			"name":"principal",
			"type": "sqlserver",
			"ip": "127.0.0.1",
			"database": "Aplicativo",
			"port": 1433,
			"usr": "sa",
			"pwd": "SecurePwd"
		}
	],
	"services": [
		{
			"name":"service",
			"type": "rest",
			"ip": "127.0....",
			"port": 8080,
			"url": "http://...",
			"method":"GET"
		}	
	],
	"servicebus": [
		{
			"name":"bus",
			"type": "osb",
			"ip": "127.0....",
			"port": 8080
		}
	]
}
```

Objeto alarma para ser reflejado en el monitoreo  
```json
{
	"datetime":"2019-05-09T22:13:10.042Z",
	"application":"Aplicativo",
	"type":"databases",
	"name":"principal",
	"status_response":"('HYT00', '[HYT00] [Microsoft][ODBC Driver 17 for SQL Server]Login timeout expired (0) (SQLDriverConnect)')",
	"status":false
}
```

## Contributors

Javier Rodríguez  
[francisco.rodriguez@axity.com]  
Diego Cárcamo  
[diego.carcamo@axity.com]  

## License

[MIT](https://opensource.org/licenses/MIT)