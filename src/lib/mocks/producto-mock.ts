import {
  AccionStock,
  ProductoDetalle,
  ProductosQuery,
  ProductosResponse,
} from "@/types/producto";
import { ProductoFormValues } from "@/lib/validations/producto";

const STORAGE_KEY = "tuerca-perno-productos-mock";

// Categorías simuladas
export const MOCK_CATEGORIAS = [
  { id: 1, nombre: "Tornillería y Bulonería" },
  { id: 2, nombre: "Herramientas Manuales" },
  { id: 3, nombre: "Herramientas Eléctricas" },
  { id: 4, nombre: "Materiales de Construcción" },
  { id: 5, nombre: "Plomería y Sanitarios" },
  { id: 6, nombre: "Electricidad" },
  { id: 7, nombre: "Pinturería" },
  { id: 8, nombre: "Corralón / Áridos" },
];

// Marcas simuladas
export const MOCK_MARCAS = [
  { id: 1, nombre: "Stanley" },
  { id: 2, nombre: "Bosch" },
  { id: 3, nombre: "Makita" },
  { id: 4, nombre: "Bahco" },
  { id: 5, nombre: "Tramontina" },
  { id: 6, nombre: "Sin Marca (Genérico)" },
];

// Productos iniciales de prueba (abastece el catálogo y el panel)
const PRODUCTOS_INICIALES: ProductoDetalle[] = [
  {
    id: 1,
    nombre: "Taladro Percutor 750W",
    precio: "85000.00",
    stock: 15,
    categoria: "Herramientas Eléctricas",
    categoria_id: 3,
    marca: "Bosch",
    marca_id: 2,
    descripcion: "Taladro percutor eléctrico de 750W con mandril de 13mm, velocidad variable y reversible.",
  },
  {
    id: 2,
    nombre: "Juego de Llaves Combinadas 6-22mm (12 piezas)",
    precio: "32000.00",
    stock: 25,
    categoria: "Herramientas Manuales",
    categoria_id: 2,
    marca: "Bahco",
    marca_id: 4,
    descripcion: "Juego de llaves combinadas de acero cromo vanadio forjado, acabado cromado mate.",
  },
  {
    id: 3,
    nombre: "Tornillos Hexagonales Grado 5 (Caja x 100u)",
    precio: "4500.00",
    stock: 100,
    categoria: "Tornillería y Bulonería",
    categoria_id: 1,
    marca: "Sin Marca (Genérico)",
    marca_id: 6,
    descripcion: "Caja de tornillos hexagonales de acero templado, rosca métrica M8 x 40mm.",
  },
  {
    id: 4,
    nombre: "Amoladora Angular 4 1/2″ 850W",
    precio: "72500.00",
    stock: 8,
    categoria: "Herramientas Eléctricas",
    categoria_id: 3,
    marca: "Makita",
    marca_id: 3,
    descripcion: "Amoladora compacta de 850W con traba de eje y protección contra sobrecargas.",
  },
  {
    id: 5,
    nombre: "Bolsón de Arena Fina de Río (1 m³)",
    precio: "38900.00",
    stock: 4,
    categoria: "Corralón / Áridos",
    categoria_id: 8,
    marca: "Sin Marca (Genérico)",
    marca_id: 6,
    descripcion: "Arena de río lavada y zarandeada en bolsón big-bag de 1 metro cúbico.",
  },
  {
    id: 6,
    nombre: "Nivel de Mano Tubular de Aluminio 60cm",
    precio: "18200.00",
    stock: 12,
    categoria: "Herramientas Manuales",
    categoria_id: 2,
    marca: "Stanley",
    marca_id: 1,
    descripcion: "Nivel tubular de aluminio con 3 burbujas (0°, 45° y 90°) resistente a impactos.",
  },
  {
    id: 7,
    nombre: "Perno de Anclaje de Expansión 3/8″ x 3″",
    precio: "1250.00",
    stock: 350,
    categoria: "Tornillería y Bulonería",
    categoria_id: 1,
    marca: "Sin Marca (Genérico)",
    marca_id: 6,
    descripcion: "Pernos de anclaje para hormigón y mampostería maciza con arandela y tuerca incluida.",
  },
  {
    id: 8,
    nombre: "Grifería Monocomando para Cocina",
    precio: "48000.00",
    stock: 6,
    categoria: "Plomería y Sanitarios",
    categoria_id: 5,
    marca: "Tramontina",
    marca_id: 5,
    descripcion: "Grifería de mesada monocomando de latón cromado con pico móvil y aireador espumante.",
  },
];

let memoryProductos: ProductoDetalle[] = [...PRODUCTOS_INICIALES];

// Obtiene los productos guardados o inicializa los datos
function getStoredProductos(): ProductoDetalle[] {
  if (typeof window === "undefined") {
    return memoryProductos;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProductos));
    return memoryProductos;
  }

  try {
    const parsed = JSON.parse(stored) as ProductoDetalle[];
    memoryProductos = parsed;
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTOS_INICIALES));
    memoryProductos = [...PRODUCTOS_INICIALES];
    return memoryProductos;
  }
}

// Guarda los productos
function saveProductos(productos: ProductoDetalle[]): void {
  memoryProductos = productos;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  }
}

// Devuelve los productos con soporte de filtros, búsqueda y paginación
export function mockFetchProductos(query?: ProductosQuery): ProductosResponse {
  let productos = [...getStoredProductos()];

  // Filtro por categoría
  if (query?.categoria) {
    const cat = query.categoria.toLowerCase().trim();
    productos = productos.filter((p) => {
      const nombreCat =
        typeof p.categoria === "string" ? p.categoria : p.categoria.nombre;
      return nombreCat.toLowerCase().includes(cat);
    });
  }

  // Búsqueda por texto (nombre, marca o descripción)
  if (query?.search) {
    const q = query.search.toLowerCase().trim();
    productos = productos.filter((p) => {
      const nombreMarca =
        typeof p.marca === "string" ? p.marca : p.marca.nombre;
      return (
        p.nombre.toLowerCase().includes(q) ||
        nombreMarca.toLowerCase().includes(q) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q))
      );
    });
  }

  const total = productos.length;
  const PAGE_SIZE = 8;
  const page = query?.page && query.page > 0 ? query.page : 1;
  const start = (page - 1) * PAGE_SIZE;
  const pagedResults = productos.slice(start, start + PAGE_SIZE);

  return {
    count: total,
    next: start + PAGE_SIZE < total ? `/api/productos/?page=${page + 1}` : null,
    previous: page > 1 ? `/api/productos/?page=${page - 1}` : null,
    results: pagedResults,
  };
}

// Devuelve un producto por ID
export function mockFetchProductoById(
  id: string | number
): ProductoDetalle | null {
  const producto = getStoredProductos().find((p) => p.id === Number(id));
  return producto ?? null;
}

// Actualiza stock en mock
export function mockActualizarStock(
  productoId: number | string,
  accion: AccionStock,
  cantidad: number
): ProductoDetalle {
  const productos = getStoredProductos();
  const index = productos.findIndex((p) => p.id === Number(productoId));

  if (index === -1) {
    throw new Error("Producto no encontrado en inventario.");
  }

  let nuevoStock = productos[index].stock;
  if (accion === "sumar") nuevoStock += cantidad;
  if (accion === "restar") nuevoStock = Math.max(0, nuevoStock - cantidad);
  if (accion === "fijar") nuevoStock = cantidad;

  const actualizado = { ...productos[index], stock: nuevoStock };
  productos[index] = actualizado;
  saveProductos(productos);
  return actualizado;
}

// Crea un producto
export function mockCreateProducto(values: ProductoFormValues): Response {
  const productos = getStoredProductos();

  const categoriaId = Number(values.categoria_id);
  const marcaId = Number(values.marca_id);

  const categoria = MOCK_CATEGORIAS.find((item) => item.id === categoriaId);
  const marca = MOCK_MARCAS.find((item) => item.id === marcaId);

  if (!categoria || !marca) {
    return new Response(
      JSON.stringify({
        non_field_errors: ["La categoría o marca seleccionada no existe."],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const nuevoProducto: ProductoDetalle = {
    id: Math.max(0, ...productos.map((p) => p.id)) + 1,
    nombre: values.nombre,
    precio: Number(values.precio).toFixed(2),
    stock: Number.parseInt(values.stock, 10),
    categoria: categoria.nombre,
    categoria_id: categoriaId,
    marca: marca.nombre,
    marca_id: marcaId,
    descripcion: values.descripcion ?? "",
  };

  saveProductos([...productos, nuevoProducto]);

  return new Response(JSON.stringify(nuevoProducto), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// Actualiza un producto
export function mockUpdateProducto(
  id: string | number,
  values: ProductoFormValues
): Response {
  const productos = getStoredProductos();

  const index = productos.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return new Response(
      JSON.stringify({
        non_field_errors: ["El producto no existe."],
      }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const categoriaId = Number(values.categoria_id);
  const marcaId = Number(values.marca_id);

  const categoria = MOCK_CATEGORIAS.find((item) => item.id === categoriaId);
  const marca = MOCK_MARCAS.find((item) => item.id === marcaId);

  if (!categoria || !marca) {
    return new Response(
      JSON.stringify({
        non_field_errors: ["La categoría o marca seleccionada no existe."],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const productoActualizado: ProductoDetalle = {
    ...productos[index],
    nombre: values.nombre,
    precio: Number(values.precio).toFixed(2),
    stock: Number.parseInt(values.stock, 10),
    categoria: categoria.nombre,
    categoria_id: categoriaId,
    marca: marca.nombre,
    marca_id: marcaId,
    descripcion: values.descripcion ?? "",
  };

  productos[index] = productoActualizado;
  saveProductos(productos);

  return new Response(JSON.stringify(productoActualizado), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Elimina un producto
export function mockDeleteProducto(id: string | number): Response {
  const productos = getStoredProductos();

  const filtrados = productos.filter((p) => p.id !== Number(id));

  if (filtrados.length === productos.length) {
    return new Response(null, { status: 404 });
  }

  saveProductos(filtrados);

  return new Response(null, { status: 204 });
}