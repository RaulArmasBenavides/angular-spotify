// Desarrollo local: usado por `ng serve` / `ng build` (configuración development).
// La API local corre en PORT=3001 (ver node-api-tracks/.env).
export const environment = {
  production: false,
  api: 'http://localhost:3001/api/v1'
};
