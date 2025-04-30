import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  scenarios: {
    // 1) Registro de 30 usuarios
    registro: {
      executor: 'per-vu-iterations',
      vus: 30,             // 30 VUs en paralelo
      iterations: 1,       // cada VU hace 1 petición
      exec: 'registro',    // función a ejecutar
    },
    // 2) Búsqueda con ramp-up/ramp-down de 15 → 20 → 15 VUs
    busqueda: {
      executor: 'ramping-vus',
      startVUs: 15,
      stages: [
        { duration: '30s', target: 20 },  // sube hasta 20 VUs
        { duration: '30s', target: 15 },  // baja hasta 15 VUs
      ],
      gracefulRampDown: '30s',
      startTime: '30s',   // espera 30s para que termine el registro
      exec: 'busqueda',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // opcional: 95% de requests < 500 ms
  },
};

// Función de registro: un VU crea un usuario distinto
export function registro() {
  const id = __VU;  // 1…30
  const payload = JSON.stringify({
    usuario:    `user${id}`,
    nombre:     `Usuario ${id}`,
    contrasenia: `Pwd!${id}Abc`,   // pon aquí tu lógica de password
    theme:      1,
    admin:      false,
    activo:     true,
  });
  const res = http.post(
    'http://localhost:3000/usuarios/crear',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'registro OK': (r) => r.status === 201 || r.status === 200 });
  sleep(1);
}

// Función de búsqueda: llama al endpoint /libros con parámetros aleatorios
export function busqueda() {
  // Generamos valores aleatorios para los query params
  const page      = Math.floor(Math.random() * 5) + 1;      // 1–5
  const size      = [5, 10, 20][Math.floor(Math.random() * 3)];
  const campos    = ['titulo','anio_publicacion','autores'];
  const sortBy    = campos[Math.floor(Math.random() * campos.length)];
  const sortOrder = Math.random() > 0.5 ? 'asc' : 'desc';
  const year      = 2000 + Math.floor(Math.random() * 25);  // 2000–2024
  const autores   = ['Márquez','Rowling','King','Asimov'];
  const autor     = autores[Math.floor(Math.random() * autores.length)];

  const url = `http://localhost:3000/libros` +
    `?page=${page}` +
    `&size=${size}` +
    `&sortBy=${sortBy}` +
    `&sortOrder=${sortOrder}`;

  const res = http.get(url, { headers: { Accept: 'application/json' } });
  check(res, {
    'status 200':     (r) => r.status === 200,
    'tiene contenido':(r) => r.body && r.body.length > 0,
  });
  sleep(1);
}
