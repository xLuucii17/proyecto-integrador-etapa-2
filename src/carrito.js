const listaProductos = document.querySelector('#lista-carrito tbody')
const listaCompra = document.querySelector('#lista-compra')
// Añadir un producto al carrito
export function comprarProducto(e) {
    e.preventDefault() 
    if ( e.target.classList.contains('agregar-carrito') ) {
        const producto = e.target.parentElement.parentElement
        console.log(producto)
        leerDatosProducto(producto)
    } 
}

// Leer datos del producto

function leerDatosProducto(producto) {
            // Precio sin $
    const precioCompleto = producto.querySelector('.precio').textContent
    const precioNumeroSolo = precioCompleto.slice(1) 
    const precioDef = Number(precioNumeroSolo)


    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h5').textContent,
        precio: precioDef,
        artista: producto.querySelector('.artista').textContent,
        year: producto.querySelector('.year').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),        
        cantidad: 1
    }

    let productosLS
    productosLS = obtenerProductosLocalStorage()

    productosLS.forEach(function(productoLS) {
        if(productoLS.id === infoProducto.id) {
            productosLS = productoLS.id;
        }
    })

    if ( productosLS === infoProducto.id ) {
        console.warn('El producto ya está (en el carrito) en el localStorage')
    } else {
        insertarCarrito(infoProducto)
    }

}
// Comprobar que hay elementos en el LS
function obtenerProductosLocalStorage() {
    let productosLS

    // Comprobar si hay algo en el LS
    if ( localStorage.getItem('productos') === null ) {
        productosLS = []
    }
    else {
        productosLS = JSON.parse(localStorage.getItem('productos'))
    }
    return productosLS
}

// Muestra producto seleccionado en carrito
function insertarCarrito(producto) {
    const row = document.createElement('tr')

    row.innerHTML = `
        <td>
            <img src="${producto.imagen}" alt="${producto.titulo}" width="100">
        </td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>
            <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
        </td>
    `
    listaProductos.appendChild(row)
    guardarProductosLocalStorage(producto)
}

// Almacenar en el LS
function guardarProductosLocalStorage(producto) {
    let productos

    // Toma valor de un arreglo con datos del LS
    productos = obtenerProductosLocalStorage()

    // Agrego el producto al carrito
    productos.push(producto)
    // Agregamos al LS
    localStorage.setItem('productos', JSON.stringify(productos))
     
}

export function leerLocalStorage() {
    let productosLS
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach(function (producto) {
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>
            <img src="${producto.imagen}" alt="${producto.titulo}" width="100">
        </td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>
            <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
        </td>
        `
        listaProductos.appendChild(row)
    })


}
// Eliminar el producto del carrito en el DOM 
export function eliminarProducto(e) {
    e.preventDefault()
    let producto, productoID
    if ( e.target.classList.contains('borrar-producto')) {
        //e.target.parentElement.parentElement.remove()
        producto = e.target.parentElement.parentElement
        productoID = producto.querySelector('a').getAttribute('data-id')
        producto.remove()
        eliminarProductoLocalStorage(productoID)
    }
}

// Eliminar producto Por ID del LS
function eliminarProductoLocalStorage(productoID) {
    let productosLS
    // Obtenemos el arreglo de productos
    productosLS = obtenerProductosLocalStorage()
    // Comparamos el id del producto borrado con el LS
    productosLS.forEach(function(productoLS, index) {
        if(productoLS.id === productoID) {
            productosLS.splice(index, 1)
        }
    })

    // Añadimos el arreglo actual al LS
    localStorage.setItem('productos', JSON.stringify(productosLS))
}

export function vaciarCarrito(e) {
    e.preventDefault()
    while(listaProductos.firstChild) {
        listaProductos.removeChild(listaProductos.firstChild)
    }
    vaciarLocalStorage()

    return false
}

function vaciarLocalStorage() {
    window.localStorage.clear()
}

// Procesando el pedido
export function procesarPedido(e) {
    e.preventDefault() // Detener el comportamiento por defecto de los <a> o los <form>
    let array = obtenerProductosLocalStorage()
    if ( array.length === 0 ) {
        console.warn('El carrito está vacío')
    } else {
        location.href = 'pages/carrito.html'
    }


}




// Mostrar los productos guardados en el LS en la página de carrito.html
export function leerLocalStorageCompra() {
    let productosLS
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach(function (producto) {
            const precioProducto = producto.cantidad * producto.precio
            console.log(precioProducto) 
         const div = document.createElement('div')
         div.classList.add('row', 'py-3', 'mb-3')
         div.innerHTML = `
            <div class="col-4 mb-1">
                <!-- imagen -->
                <div class="bg-image rounded">
                <img class="w-100" src="${producto.imagen}" alt="${producto.titulo}"></div>
            </div>
            
            <div class="col-6 mt-3">
                <h5><strong>${producto.titulo}</strong></h5>
                <p>Artista: ${producto.artista}</p>
                <p>Año: ${producto.year}</p>
                <p>Formato: </p>

                <a data-id=${producto.id} class="basura me-1 mb-2 borrar-producto-compra fas fa-trash text-dark"></a>
            
                </div>

            <div class="col-2 mt-3">
                <input type="number" min="1" class="form-control text-center p-1 cantidad" placeholder="Cantidad" value="${producto.cantidad}">
                <p class="text-center mt-4"><strong class="precio">${ precioProducto  }</strong></p>
            </div>
         `
         listaCompra.appendChild(div)
    })
}

// Elimina el producto del carrito.html

export const eliminarProductoCompra = (e) => {
    e.preventDefault()
    // console.log('Hicieron click', e.target)
    let productoID
    if ( e.target.classList.contains('borrar-producto-compra')) {
    e.target.parentElement.parentElement.remove()
    let producto = e.target.parentElement.parentElement
    productoID = producto.querySelector('a').getAttribute('data-id')
}
eliminarProductoLocalStorage(productoID)
}

// Obtener evento para detectar el cambio en el input de cantidad
export const obtenerEvento = (e) => {
    // console.log(e.target)
    e.preventDefault()

    if ( e.target.classList.contains('cantidad') ) {
        console.log('Cambio el input')

        let producto = e.target.parentElement.parentElement
        let id = producto.querySelector('a').getAttribute('data-id')
        let cantidad = producto.querySelector('input').value
        let precio = producto.querySelector('.precio')

        let productosLS = obtenerProductosLocalStorage()
        productosLS.forEach(function (productoLS, index) {
            if (productoLS.id === id) {
                productoLS.cantidad = cantidad
        console.log(productoLS.cantidad)
        console.log(productoLS.precio)
                let total = Number(productoLS.cantidad) * Number(productoLS.precio)
                precio.textContent = total.toFixed(2)
            }
        })
        localStorage.setItem('productos', JSON.stringify(productosLS))
        calcularTotal()
    }

}
//  Calcula el total del carrito
export function calcularTotal() {
    let productosLS
    let total = 0, subTotal = 0, impuestos = 0
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach( productoLS => {
        let totalProducto = Number(productoLS.cantidad * productoLS.precio)
        total = total + totalProducto 
})
        impuestos = parseFloat(total * 0.18).toFixed(2)
        subTotal = parseFloat(total-impuestos).toFixed(2)

        document.querySelector('#total').textContent = total.toFixed(2)
        document.querySelector('#sub-total').textContent = subTotal
        document.querySelector('#iva').textContent = impuestos
    
    
}