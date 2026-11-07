import {
    ProductoDetalle,
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
    { id: 5, nombre: "Plomería" },
    { id: 6, nombre: "Electricidad" },
    { id: 7, nombre: "Adhesivos y Selladores" },
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

// Productos iniciales de prueba
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
        descripcion: "Taladro percutor eléctrico de 750W.",
    },
    {
        id: 2,
        nombre: "Juego de Llaves Combinadas",
        precio: "32000.00",
        stock: 25,
        categoria: "Herramientas Manuales",
        categoria_id: 2,
        marca: "Bahco",
        marca_id: 4,
        descripcion: "Juego de llaves combinadas de acero.",
    },
    {
        id: 3,
        nombre: "Tornillos Hexagonales",
        precio: "4500.00",
        stock: 100,
        categoria: "Tornillería y Bulonería",
        categoria_id: 1,
        marca: "Sin Marca (Genérico)",
        marca_id: 6,
        descripcion: "Caja de tornillos hexagonales.",
    },
];

// Obtiene los productos guardados o inicializa los datos
function getStoredProductos(): ProductoDetalle[] {
    if (typeof window === "undefined") {
    return PRODUCTOS_INICIALES;
}

const stored = localStorage.getItem(STORAGE_KEY);

if (!stored) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(PRODUCTOS_INICIALES)
    );
    
    return PRODUCTOS_INICIALES;
}

try {
    return JSON.parse(stored) as ProductoDetalle[];
} catch {
    localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(PRODUCTOS_INICIALES)
);

return PRODUCTOS_INICIALES;
}
}

// Guarda los productos
function saveProductos(productos: ProductoDetalle[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}

// Devuelve todos los productos
export function mockFetchProductos(): ProductosResponse {
    const productos = getStoredProductos();
    
    return {
        count: productos.length,
        next: null,
        previous: null,
        results: productos,
    };
}

// Devuelve un producto por ID
export function mockFetchProductoById(
    id: string | number
): ProductoDetalle {
    const producto = getStoredProductos().find(
        (p) => p.id === Number(id)
    );
    
    if (!producto) {
        throw new Error("Producto no encontrado.");
    }
    
    return producto;
}

// Crea un producto
export function mockCreateProducto(
    values: ProductoFormValues
): Response {
    const productos = getStoredProductos();
    
    const categoriaId = Number(values.categoria_id);
    const marcaId = Number(values.marca_id);
    
    const categoria = MOCK_CATEGORIAS.find(
        (item) => item.id === categoriaId
    );
    
    const marca = MOCK_MARCAS.find(
        (item) => item.id === marcaId
    );
    
    if (!categoria || !marca) {
        return new Response(
            JSON.stringify({
                non_field_errors: ["La categoría o marca seleccionada no existe."],
            }),
            { status: 400 }
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
    
    return new Response(
        JSON.stringify(nuevoProducto),
        { status: 201 }
    );
}

// Actualiza un producto
export function mockUpdateProducto(
    id: string | number,
    values: ProductoFormValues
): Response {
    const productos = getStoredProductos();
    
    const index = productos.findIndex(
        (p) => p.id === Number(id)
    );
    
    if (index === -1) {
        return new Response(
            JSON.stringify({
                non_field_errors: ["El producto no existe."],
            }),
            { status: 404 }
        );
    }
    
    const categoriaId = Number(values.categoria_id);
    const marcaId = Number(values.marca_id);
    
    const categoria = MOCK_CATEGORIAS.find(
    (item) => item.id === categoriaId
    );
    const marca = MOCK_MARCAS.find(
        (item) => item.id === marcaId
    );
    
    if (!categoria || !marca) {
        return new Response(
        JSON.stringify({
            non_field_errors: ["La categoría o marca seleccionada no existe."],
        }),
        { status: 400 }
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

return new Response(
    JSON.stringify(productoActualizado),
    { status: 200 }
);
}

// Elimina un producto
export function mockDeleteProducto(
    id: string | number
): Response {
    const productos = getStoredProductos();
    
    const filtrados = productos.filter(
        (p) => p.id !== Number(id)
    );
    
    if (filtrados.length === productos.length) {
        return new Response(null, { status: 404 });
    }
    
    saveProductos(filtrados);
    
    return new Response(null, { status: 204 });
}