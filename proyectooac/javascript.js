const componentes = [
    { nombre: "Tarjeta de Red", irq: 9, duracion: 7 },
    { nombre: "Disco", irq: 14, duracion: 12 },
    { nombre: "Teclado", irq: 1, duracion: 5 },
    { nombre: "COM1", irq: 4, duracion: 4 },
    { nombre: "COM4", irq: 3, duracion: 10 }
];
let dispositivo = []
let interrupciones = []; // Lista de interrupciones

// Cargar la lista de componentes
document.addEventListener("DOMContentLoaded", () => {
    cargarListaComponentes();
});

// Actualiza la lista visible de componentes
function cargarListaComponentes() {
    const lista = document.getElementById("lista-componentes");
    lista.innerHTML = ""; // Limpia la lista existente
    componentes.forEach((componente, index) => {
        const li = document.createElement("li");
        li.textContent = `${componente.nombre} (IRQ: ${componente.irq}, Duración: ${componente.duracion} seg)`;
        li.setAttribute("data-index", index);
        lista.appendChild(li);
    });
}

// Función para agregar un nuevo dispositivo
function AgregarDispositivo() {
    const nombre = document.getElementById("nuevo-dispositivo").value.trim();
    const irq = parseInt(document.getElementById("nuevo-IRQ").value.trim(), 10);
    const duracion = parseInt(document.getElementById("nuevo-duracion").value.trim(), 10);

    // Validar datos ingresados
    if (!nombre || isNaN(irq) || isNaN(duracion)) {
        alert("Por favor, ingrese valores válidos para todos los campos.");
        return;
    }

    // Agregar el nuevo dispositivo al arreglo
    componentes.push({ nombre, irq, duracion });

    // Actualizar la lista visible
    cargarListaComponentes();

    // Limpiar los inputs
    document.getElementById("nuevo-dispositivo").value = "";
    document.getElementById("nuevo-IRQ").value = "";
    document.getElementById("nuevo-duracion").value = "";

    console.log("Nuevo dispositivo agregado:", { nombre, irq, duracion });
}

function agregarInterrupcion() {
    const componenteSeleccionado = interrupciones.length < componentes.length
        ? componentes[interrupciones.length]
        : null;

    if (componenteSeleccionado) {
        interrupciones.push(componenteSeleccionado);
        actualizarTabla();
    }
}

// Actualizar la tabla de interrupciones
function actualizarTabla() {
    const tabla = document.getElementById("tabla-interrupciones");
    tabla.innerHTML = ""; // Limpiar tabla existente

    interrupciones.forEach((interrupcion, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>T = ${3 + index * 4} seg</td>
            <td>${interrupcion.nombre}</td>
            <td>${interrupcion.irq}</td>
            <td>${interrupcion.duracion} seg</td>
        `;
        tabla.appendChild(fila);
    });
}

function actualizarTabla2() {
    const cabezaTabla = document.getElementById("cabezadetabla");
    const cuerpoTabla = document.getElementById("cuerpo-tabla");

    // Limpia el encabezado y el cuerpo
    cabezaTabla.innerHTML = "<tr><th>Programa (s/p)</th></tr>";
    cuerpoTabla.innerHTML = "";

    // Actualizar encabezado con dispositivos
    dispositivo.forEach((dispositivo) => {
        const nuevaColumnaHeader = document.createElement("th");
        nuevaColumnaHeader.textContent = `${dispositivo.nombre} (p=${dispositivo.irq})`;
        cabezaTabla.querySelector("tr").appendChild(nuevaColumnaHeader);
    });

    // Tiempo inicial
    let tiempoAcumulado = 0;

    // Crear filas dinámicas para tiempos y datos específicos
    for (let i = 0; i < dispositivo.length; i++) {
        // Crear la fila inicial para el tiempo de inicio
        const filaInicio = document.createElement("tr");

        if (i === 0) {
            // Solo para la primera fila, crea una celda con rowSpan para "Programa"
            const celdaPrograma = document.createElement("td");
            celdaPrograma.rowSpan = dispositivo.length * 2; // Combina las filas
            celdaPrograma.textContent = "Programa (s/p)";
            filaInicio.appendChild(celdaPrograma);
        }

        // Celda del tiempo inicial
        const celdaTiempoInicio = document.createElement("td");
        celdaTiempoInicio.textContent = `T=${tiempoAcumulado}`;
        filaInicio.appendChild(celdaTiempoInicio);

        // Celdas vacías para los dispositivos
        dispositivo.forEach(() => {
            const celdaVacia = document.createElement("td");
            celdaVacia.textContent = ""; // Celda vacía
            filaInicio.appendChild(celdaVacia);
        });

        // Agregar la fila inicial al cuerpo
        cuerpoTabla.appendChild(filaInicio);

        // Incrementar el tiempo acumulado y crear la fila final
        tiempoAcumulado += dispositivo[i].duracion;
        const filaFinal = document.createElement("tr");

        // Celda del tiempo final
        const celdaTiempoFinal = document.createElement("td");
        celdaTiempoFinal.textContent = `T=${tiempoAcumulado}`;
        filaFinal.appendChild(celdaTiempoFinal);

        // Celdas con datos o vacías
        dispositivo.forEach((_, index) => {
            const celdaDispositivo = document.createElement("td");
            if (index === i) {
                // Llena la celda correspondiente al dispositivo actual
                celdaDispositivo.textContent = `T=${tiempoAcumulado} (${dispositivo[i].duracion} seg)`;
            } else {
                celdaDispositivo.textContent = ""; // Celda vacía
            }
            filaFinal.appendChild(celdaDispositivo);
        });

        // Agregar la fila final al cuerpo
        cuerpoTabla.appendChild(filaFinal);
    }
}

function agregaraDiag() {
    const componenteSeleccionado = dispositivo.length < componentes.length
        ? componentes[dispositivo.length]
        : null;

    if (componenteSeleccionado) {
        dispositivo.push(componenteSeleccionado);
        actualizarTabla2();
    }
}

// Llama a actualizarTabla2 al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarTabla2();
});


// Llama a actualizarTabla2 al cargar la página para mostrar los datos iniciales
document.addEventListener("DOMContentLoaded", actualizarTabla2);
