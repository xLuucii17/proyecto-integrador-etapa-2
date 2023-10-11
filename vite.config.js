import {resolve} from 'node:path'

// console.log(resolve('pages'))

export default {
    server: {
        port: "2222",
    },
    css: {
        devSourcemap: true,
    },

    build: {
        emptyOutdir: true,
        rollupOptions: {
            input: {
                carrito: resolve ('pages/carrito.html'),
                nosotros: resolve ('pages/nosotros.html'),
                inicio: resolve ('index.html'),
                cds: resolve ('pages/cds.html'),
                vinilos: resolve ('pages/vinilos.html'),
                cassettes: resolve ('pages/cassettes.html'),
                outlet: resolve ('pages/outlet.html')
            }

        }
    }
}