const componentes = [
    { nombre: "Tarjeta de Red", irq: 9, duracion: 7 },
    { nombre: "Disco", irq: 14, duracion: 12 },
    { nombre: "Teclado", irq: 1, duracion: 5 },
    { nombre: "COM1", irq: 4, duracion: 4 },
    { nombre: "COM4", irq: 3, duracion: 10 }
];

let interrupciones = [];

// Cargar la lista de componentes
document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-componentes");

    componentes.forEach((componente, index) => {
        const li = document.createElement("li");
        li.textContent = `${componente.nombre} (IRQ: ${componente.irq}, Duración: ${componente.duracion} seg)`;
        li.setAttribute("data-index", index);
        li.onclick = () => seleccionarComponente(index);
        lista.appendChild(li);
    });
});

// Función para agregar una interrupción
function agregarInterrupcion() {
    if (interrupciones.length >= 5) {
        alert("No puedes agregar más de 5 interrupciones.");
        return;
    }

    const componenteSeleccionado = interrupciones.length < componentes.length
        ? componentes[interrupciones.length]
        : null;

    if (componenteSeleccionado) {
        interrupciones.push(componenteSeleccionado);
        actualizarTabla();
    }
}
function AgregarDispositivo(){
    
}
// Actualizar la tabla de interrupciones
function actualizarTabla() {
    const tabla = document.getElementById("tabla-interrupciones");
    tabla.innerHTML = ""; // Limpiar tabla

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

/*
const componentes = [
    { nombre: "Reloj del sistema", irq: 0, prioridad: 1, duracion: 1 },
    { nombre: "Teclado", irq: 1, prioridad: 2, duracion: 2 },
    { nombre: "Controlador PIC", irq: 2, prioridad: 3, duracion: 2 },
    { nombre: "Puerto serie COM2 y COM4", irq: 3, prioridad: 11, duracion: 10 },
    { nombre: "Puerto serie COM1 y COM3", irq: 4, prioridad: 12, duracion: 10 },
    { nombre: "Controlador de disquete", irq: 6, prioridad: 14, duracion: 20 },
    { nombre: "Puerto paralelo", irq: 7, prioridad: 15, duracion: 18 },
    { nombre: "Reloj en tiempo real", irq: 8, prioridad: 3, duracion: 1 },
    { nombre: "Controlador ACPI", irq: 9, prioridad: 4, duracion: 25 },
    { nombre: "Controlador primario de disco", irq: 14, prioridad: 8, duracion: 50 },
    { nombre: "Controlador secundario de disco", irq: 15, prioridad: 9, duracion: 55 }
];

*/ 
