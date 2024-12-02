const componentes = [
    { nombre: "Tarjeta de Red", irq: 9, duracion: 7 },
    { nombre: "Disco", irq: 14, duracion: 12 },
    { nombre: "Teclado", irq: 1, duracion: 5 },
    { nombre: "COM1", irq: 4, duracion: 4 },
    { nombre: "COM4", irq: 3, duracion: 10 }
];
let dispositivo = [];
let interrupciones = []; // Lista de interrupciones

// Cargar la lista de componentes
document.addEventListener("DOMContentLoaded", () => {
    cargarListaComponentes();
    actualizarTabla2(); // Inicializa el diagrama de procesos
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

    // Validar datos ingresados y evitar duplicados
    if (!nombre || isNaN(irq) || irq <= 0 || isNaN(duracion) || duracion <= 0) {
        alert("Por favor, ingrese valores válidos para todos los campos. IRQ y Duración deben ser mayores a 0.");
        return;
    }

    if (componentes.some(c => c.nombre === nombre || c.irq === irq)) {
        alert("El dispositivo ya existe o tiene un IRQ duplicado.");
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
        actualizarTabla(); // Actualizar tabla de interrupciones
        actualizarBitacora(); // Actualizar la bitácora
        actualizarTabla2(); // Actualizar el diagrama de procesos
    } else {
        console.warn("No hay más dispositivos para generar interrupciones.");
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

    // Tiempo inicial basado en la primera interrupción
    let tiempoAcumulado = interrupciones.length > 0 && !isNaN(interrupciones[0].tiempoInicio)
        ? interrupciones[0].tiempoInicio
        : 3;

    // Crear filas dinámicas para tiempos y datos específicos
    for (let i = 0; i < dispositivo.length; i++) {
        // Validación de valores
        if (isNaN(interrupciones[i].tiempoInicio) || isNaN(dispositivo[i].duracion)) {
            console.error(`Error: El tiempo de inicio o duración del dispositivo ${dispositivo[i].nombre} es inválido.`);
            return;
        }

        console.log(`Procesando dispositivo: ${dispositivo[i].nombre}`);
        console.log(`Tiempo de inicio: ${interrupciones[i].tiempoInicio}, Duración: ${dispositivo[i].duracion}`);

        // Crear la fila inicial para el tiempo de inicio
        const filaInicio = document.createElement("tr");

        // Celda del tiempo inicial en la columna "Programa (s/p)"
        const celdaTiempoInicio = document.createElement("td");
        celdaTiempoInicio.textContent = `T=${interrupciones[i].tiempoInicio}`;
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
        tiempoAcumulado = interrupciones[i].tiempoInicio + dispositivo[i].duracion;
        const filaFinal = document.createElement("tr");

        // Celda del tiempo final en la columna "Programa (s/p)"
        const celdaTiempoFinal = document.createElement("td");
        celdaTiempoFinal.textContent = `T=${tiempoAcumulado}`;
        filaFinal.appendChild(celdaTiempoFinal);

        // Celdas con datos o vacías para los dispositivos
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





// Agregar dispositivos al diagrama de procesos
function agregaraDiag() {
    const componenteSeleccionado = interrupciones[dispositivo.length];

    if (componenteSeleccionado) {
        dispositivo.push(componenteSeleccionado);
        actualizarTabla2();
    } else {
        console.warn("No hay más dispositivos para agregar al diagrama.");
    }
}

// Actualizar la bitácora de interrupciones
function actualizarBitacora() {
    const tablaBitacora = document.querySelector("#tabla-bitacora tbody");
    tablaBitacora.innerHTML = ""; // Limpia la tabla antes de actualizarla

    let tiempoActual = interrupciones.length > 0 ? 3 : 0;

    interrupciones.forEach((interrupcion, index) => {
        const { nombre, duracion } = interrupcion;

        if (isNaN(duracion) || duracion <= 0) {
            console.error(`Error: La interrupción ${index} tiene una duración inválida (${duracion}).`);
            return;
        }

        const siguienteInterrupcion = index + 1 < interrupciones.length
            ? interrupciones[index + 1]
            : null;

        const rangoInicio = tiempoActual;
        const rangoFin = siguienteInterrupcion
            ? Math.min(rangoInicio + duracion, siguienteInterrupcion.tiempoInicio || Infinity)
            : rangoInicio + duracion;

        const fueInterrumpido = siguienteInterrupcion
            ? siguienteInterrupcion.tiempoInicio < rangoFin
            : false;

        const rango = `${rangoInicio}-${rangoFin}`;
        const tiempoFaltante = fueInterrumpido
            ? rangoInicio + duracion - siguienteInterrupcion.tiempoInicio
            : "";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>a los ${rangoInicio} seg.</td>
            <td>${nombre}</td>
            <td>${fueInterrumpido ? "SÍ" : "NO"}</td>
            <td>${rango}</td>
            <td>${tiempoFaltante}</td>
        `;
        tablaBitacora.appendChild(fila);

        tiempoActual = rangoFin;
    });
}
