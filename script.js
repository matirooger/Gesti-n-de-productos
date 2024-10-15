// LA CLASE QUE CREA AL PRODUCTO
class Producto {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    mostrarInfo() {
        return `${this.nombre} - Precio: $${this.precio} - Cantidad: ${this.cantidad}`;
    }
}

// Recuperar productos del localStorage y convertirlos a instancias de Producto
let productos = JSON.parse(localStorage.getItem('productos'))?.map(p => new Producto(p.nombre, p.precio, p.cantidad)) || [];
let productoEnEdicion = null; // Almacena el índice del producto que está siendo editado

document.getElementById('form-agregar-producto').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    // Validaciones
    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert("Todos los campos son obligatorios y deben contener valores válidos.");
        return;
    }

    if (productoEnEdicion === null) {
        // Agregar nuevo producto
        const nuevoProducto = new Producto(nombre, precio, cantidad);
        productos.push(nuevoProducto);
    } else {
        // Actualizar producto existente
        productos[productoEnEdicion].nombre = nombre;
        productos[productoEnEdicion].precio = precio;
        productos[productoEnEdicion].cantidad = cantidad;
        productoEnEdicion = null; // Reiniciar el modo de edición
    }

    guardarEnLocalStorage();
    mostrarProductos();
    limpiarFormulario();
});

// FUNCION PARA MOSTRAR PRODUCTOS
function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productos.forEach((producto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${producto.mostrarInfo()}`;
        
        // Crear un contenedor para los botones
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right'; // Alinear a la derecha

        const editarButton = document.createElement('button');
        editarButton.classList.add('btn-editar');
        editarButton.setAttribute('data-index', index);
        editarButton.innerText = 'Editar';
        
        const eliminarButton = document.createElement('button');
        eliminarButton.classList.add('btn-eliminar');
        eliminarButton.setAttribute('data-index', index);
        eliminarButton.innerText = 'Eliminar';

        // Añadir los botones al contenedor
        buttonContainer.appendChild(editarButton);
        buttonContainer.appendChild(eliminarButton);

        // Añadir el contenedor de botones al <li>
        li.appendChild(buttonContainer);
        listaProductos.appendChild(li);
    });

    // Añadir eventos para editar y eliminar
    document.querySelectorAll('.btn-editar').forEach(boton => {
        boton.addEventListener('click', editarProducto);
    });
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', eliminarProducto);
    });
}


// FUNCION PARA EDITAR PRODUCTOS
function editarProducto(event) {
    const index = event.target.getAttribute('data-index');
    const producto = productos[index];

    // Colocar los valores del producto en el formulario
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('cantidad').value = producto.cantidad;

    productoEnEdicion = index; // Almacenar el índice del producto en edición
}

// FUNCION PARA ELIMINAR PRODUCTOS
function eliminarProducto(event) {
    const index = event.target.getAttribute('data-index');
    productos.splice(index, 1);
    guardarEnLocalStorage();
    mostrarProductos();
}

// FUNCION PARA LIMPIAR EL FORMULARIO
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('cantidad').value = '';
    productoEnEdicion = null;
}

// FUNCION PARA GUARDAR EN EL LOCAL STORAGE
function guardarEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Mostrar productos al cargar la página
mostrarProductos();
