// 1. REFERENCIAS AL DOM
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const idInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const btnSave = document.getElementById('btn-save');

// 2. ESTADO DE LA APLICACIÓN (Carga inicial desde LocalStorage)
let products = JSON.parse(localStorage.getItem('Inventario')) || [];

// 3. MÉTODO: MOSTRAR / RENDERIZAR (READ)
function renderProducts() {
    // Limpiamos la tabla antes de dibujar
    productList.innerHTML = '';

    // Si no hay productos, mostrar un mensaje
    if (products.length === 0) {
        productList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay productos registrados</td></tr>';
    }

    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
                <button class="btn-edit" onclick="prepareEdit(${product.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productList.appendChild(row);
    });

    // Guardamos la lista actualizada en LocalStorage
    localStorage.setItem('Inventario', JSON.stringify(products));
}

// 4. MÉTODO: CREAR Y ACTUALIZAR (CREATE / UPDATE)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const id = idInput.value;
    const name = nameInput.value;
    const price = priceInput.value;

    if (id === "") {
        // CREAR: Si el campo oculto ID está vacío, es un nuevo producto
        const newProduct = {
            id: Date.now(), // Genera un ID único por tiempo
            name: name,
            price: price
        };
        products.push(newProduct);
    } else {
        // ACTUALIZAR: Si tiene ID, buscamos y editamos ese producto
        products = products.map(p => {
            if (p.id == id) {
                return { ...p, name: name, price: price };
            }
            return p;
        });
        btnSave.textContent = "Guardar";
        btnSave.style.backgroundColor = "#28a745";
    }

    form.reset(); // Limpia los inputs
    idInput.value = ""; // Limpia el ID oculto
    renderProducts(); // Refresca la tabla
});

// 5. MÉTODO: ELIMINAR (DELETE)
function deleteProduct(id) {
    if (confirm('¿Deseas eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
    }
}

// 6. MÉTODO: PREPARAR EDICIÓN (Pasa los datos al formulario)
window.prepareEdit = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        nameInput.value = product.name;
        priceInput.value = product.price;
        idInput.value = product.id; // Ponemos el ID en el campo oculto
        btnSave.textContent = "Actualizar";
        btnSave.style.backgroundColor = "#007bff";
    }
}

// INICIO: Dibujar la tabla nada más cargar la página
renderProducts();