import { PaginatedResponse } from "@/types/producto";
import { FinalizarVentaResponse, Venta } from "@/types/venta";
import { esDelDia } from "@/lib/ventas";

/**
 * Mock en memoria de la API de Ventas de Django.
 * Imita las respuestas de:
 *  - GET  /api/ventas/                      -> getMockVentas()
 *  - GET  /api/ventas/ventas-del-dia/       -> getMockVentasDelDia()
 *  - POST /api/ventas/{id}/finalizar-venta/ -> finalizarMockVenta(id)
 *
 * Los datos viven en memoria: se reinician al recargar la página
 * (o con resetMockVentas() en los tests).
 */

/** Latencia simulada de red (0 en tests para que sean instantáneos). */
export const MOCK_DELAY_MS = process.env.NODE_ENV === "test" ? 0 : 400;

function simularLatencia(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

const MINUTO = 60 * 1000;
const DIA = 24 * 60 * MINUTO;

/**
 * Fecha de hoy proporcional al tiempo transcurrido desde la medianoche
 * (fraccion 0..1), para que las ventas "del día" nunca queden en el futuro.
 */
function horaDeHoy(fraccion: number, ahora: Date): string {
  const inicio = new Date(ahora);
  inicio.setHours(0, 0, 0, 0);
  const transcurrido = ahora.getTime() - inicio.getTime();
  return new Date(inicio.getTime() + transcurrido * fraccion).toISOString();
}

/** Fecha de días anteriores a una hora fija. */
function diasAtras(dias: number, hora: number, minuto: number, ahora: Date): string {
  const fecha = new Date(ahora.getTime() - dias * DIA);
  fecha.setHours(hora, minuto, 0, 0);
  return fecha.toISOString();
}

/** Ventas iniciales: 5 de hoy y 6 de días anteriores, ordenadas por fecha descendente. */
export function crearVentasIniciales(ahora: Date = new Date()): Venta[] {
  const ventas: Venta[] = [
    { id: 111, fecha: horaDeHoy(0.95, ahora), cliente: "Juan Rodríguez", total: 45800, estado: "pendiente", vendedor: "vendedor" },
    { id: 110, fecha: horaDeHoy(0.8, ahora), cliente: "Metalúrgica Central S.A.", total: 312500, estado: "pendiente", vendedor: "admin" },
    { id: 109, fecha: horaDeHoy(0.65, ahora), cliente: "Taller El Tornillo", total: 27400, estado: "cancelada", vendedor: "admin" },
    { id: 108, fecha: horaDeHoy(0.55, ahora), cliente: "Constructora Gómez Hnos.", total: 187350, estado: "finalizada", vendedor: "vendedor" },
    { id: 107, fecha: horaDeHoy(0.3, ahora), cliente: "Consumidor Final", total: 9000, estado: "finalizada", vendedor: "vendedor" },
    { id: 106, fecha: diasAtras(1, 17, 40, ahora), cliente: "Taller El Tornillo", total: 64200, estado: "pendiente", vendedor: "vendedor" },
    { id: 105, fecha: diasAtras(1, 11, 5, ahora), cliente: "Juan Rodríguez", total: 85000, estado: "finalizada", vendedor: "admin" },
    { id: 104, fecha: diasAtras(2, 16, 20, ahora), cliente: "Constructora Gómez Hnos.", total: 540000, estado: "finalizada", vendedor: "vendedor" },
    { id: 103, fecha: diasAtras(3, 9, 45, ahora), cliente: "Consumidor Final", total: 12600, estado: "cancelada", vendedor: "vendedor" },
    { id: 102, fecha: diasAtras(4, 15, 10, ahora), cliente: "Metalúrgica Central S.A.", total: 228900, estado: "finalizada", vendedor: "admin" },
    { id: 101, fecha: diasAtras(6, 10, 30, ahora), cliente: "Taller El Tornillo", total: 32000, estado: "finalizada", vendedor: "vendedor" },
  ];
  return ventas.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

let ventasEnMemoria: Venta[] | null = null;

function obtenerVentas(): Venta[] {
  if (!ventasEnMemoria) {
    ventasEnMemoria = crearVentasIniciales();
  }
  return ventasEnMemoria;
}

/** Restablece los datos iniciales (útil para tests). */
export function resetMockVentas(ventas?: Venta[]): void {
  ventasEnMemoria = ventas ? ventas.map((v) => ({ ...v })) : null;
}

/** Simula GET /api/ventas/ (respuesta paginada de DRF, ordenada por -fecha). */
export async function getMockVentas(): Promise<PaginatedResponse<Venta>> {
  await simularLatencia();
  const ventas = obtenerVentas().map((v) => ({ ...v }));
  return { count: ventas.length, next: null, previous: null, results: ventas };
}

/** Simula GET /api/ventas/ventas-del-dia/ (array plano, sin paginar). */
export async function getMockVentasDelDia(): Promise<Venta[]> {
  await simularLatencia();
  const hoy = new Date();
  return obtenerVentas()
    .filter((v) => esDelDia(v.fecha, hoy))
    .map((v) => ({ ...v }));
}

/**
 * Simula POST /api/ventas/{id}/finalizar-venta/.
 * Igual que Django: marca la venta como finalizada y responde sólo un mensaje.
 * Si el id no existe, rechaza como un 404.
 */
export async function finalizarMockVenta(id: number | string): Promise<FinalizarVentaResponse> {
  await simularLatencia();
  const venta = obtenerVentas().find((v) => v.id === Number(id));

  if (!venta) {
    throw new Error(`Venta #${id} no encontrada (404).`);
  }

  venta.estado = "finalizada";
  return { mensaje: "Venta completada exitosamente." };
}
