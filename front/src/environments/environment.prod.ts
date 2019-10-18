export const environment = {
  production: true,
  baseUrl: 'http://10.27.24.38:3000',
  nameToTitle: new Map<string, string>([
    ['queues', 'Reporte de monitoreo de Queues'],
    ['errors', 'Reporte de Bitacora de errores'],
    ['replications', 'Monitoreo de Replicación'],
    ['final_close', 'Reporte de cierre con diferencias en sábana final']
  ] )
};
