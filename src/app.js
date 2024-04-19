const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bienvenido a nuestra tienda online");
});

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit, 10);

        if (!isNaN(limit)) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).send('Error al obtener los productos: ' + error.message);
    }
});


app.get('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid, 10);
    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});