const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    static ultId = 0;

    constructor() {
        this.path = path.join(__dirname, 'productos.json');
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            this.products = [];
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer un archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    async addProduct(nuevoObjeto) {
        let { title, description, price, thumbnail, code, stock } = nuevoObjeto;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único, ingrese un código distinto.");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);

        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            return this.products;
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            throw error; 
        }
    }    

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado! ");
                return buscado;
            }

        } catch (error) {
            console.log("Error al leer el archivo ", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("no se encontró el producto");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo(); 
    
            const index = arrayProductos.findIndex(product => product.id === id);
            
            if (index !== -1) {
                arrayProductos.splice(index, 1); 
                await this.guardarArchivo(arrayProductos); 
                console.log(`Producto con id: ${id} eliminado.`);
            } else {
                console.log(`Producto con id: ${id} no encontrado para eliminar.`);
            }
    
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }
    
}

module.exports = ProductManager;