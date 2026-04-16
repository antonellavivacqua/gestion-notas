// Simulador de base de datos
// =========================================
// "BASE DE DATOS" SIMULADA (Más completa)
// =========================================
const baseDeDatosAlumnos = [
    { 
        dni: "12345678", 
        nombre: "Juan Gomez Perez", 
        ciclo: "2024",
        estado: "Regular", // Regular, Deudor, etc.
        materiasAdeudadas: ["Matemática (2023)", "Historia (2023)"],
        calificaciones: [
            { materia: "Lengua", nota: 9 },
            { materia: "Matemática", nota: 5 }, // Nota baja para probar
            { materia: "Biología", nota: 8 },
            { materia: "Inglés", nota: 10 },
            { materia: "Física", nota: 7 },
        ]
    },
    { 
        dni: "87654321", 
        nombre: "Ana Maria Lopez", 
        ciclo: "2024",
        estado: "Regular",
        materiasAdeudadas: [], // Sin materias
        calificaciones: [
            { materia: "Lengua", nota: 10 },
            { materia: "Matemática", nota: 9 },
            { materia: "Biología", nota: 10 },
            { materia: "Inglés", nota: 9 },
            { materia: "Geografía", nota: 8 },
        ]
    },
    { 
        dni: "22334455", 
        nombre: "Carlos Tevez (Simulado)", 
        ciclo: "2023",
        estado: "Deudor", // Estado visual
        materiasAdeudadas: ["Química", "Educación Física"],
        calificaciones: [
            { materia: "Lengua", nota: 6 },
            { materia: "Matemática", nota: 4 }, // Nota baja
            { materia: "Historia", nota: 7 },
        ]
    }
];

// =========================================
// LÓGICA DE ACCESO (LOGIN)
// =========================================
function login() {
    const email = document.getElementById('email').value;
    const errorMsg = document.getElementById('error-msg');

    // Simulación de validación institucional
    if (email.endsWith('@bue.edu.ar')) {
        // Validación Exitosa: Ocultar login, mostrar dashboard
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-dashboard').style.display = 'flex';
        errorMsg.innerText = ""; // Limpiar error
    } else {
        errorMsg.innerText = "Error: Use un correo institucional válido (@edu.com.ar).";
        // Pequeña animación de error en el input
        document.getElementById('email').focus();
    }
}

function logout() {
    // Recargar la página para volver al login y limpiar estado
    location.reload();
}

// =========================================
// LÓGICA DE BÚSQUEDA DINÁMICA
// =========================================
function buscarAlumnoDinamico() {
    const txtBusqueda = document.getElementById('search-dni').value.trim();
    const resultsContainer = document.getElementById('search-results-container');
    
    // Ocultar paneles de detalle y resumen si estamos buscando
    document.getElementById('student-detail-section').style.display = 'none';
    document.getElementById('dashboard-summary').style.display = 'block';

    if (txtBusqueda.length === 0) {
        // Si no hay texto, ocultar contenedor de resultados
        resultsContainer.classList.remove('results-show');
        resultsContainer.classList.add('results-hidden');
        resultsContainer.innerHTML = "";
        return;
    }

    // Filtrar alumnos que coincidan con el DNI (simulando LIKE en SQL)
    const alumnosEncontrados = baseDeDatosAlumnos.filter(alumno => 
        alumno.dni.includes(txtBusqueda)
    );

    mostrarPrevisualizacionResultados(alumnosEncontrados, resultsContainer);
}

// Muestra una lista rápida de coincidencias bajo el buscador
function mostrarPrevisualizacionResultados(alumnos, contenedor) {
    contenedor.innerHTML = ""; // Limpiar resultados anteriores

    if (alumnos.length === 0) {
        contenedor.innerHTML = '<div class="student-result-card"><p>No se encontraron alumnos.</p></div>';
    } else {
        alumnos.forEach(alumno => {
            // Determinar badge de estado
            const stateBadge = alumno.materiasAdeudadas.length > 0 
                ? '<span class="badge badge-warning">Deudor</span>' 
                : '<span class="badge badge-success">Al día</span>';

            contenedor.innerHTML += `
                <div class="student-result-card" onclick="seleccionarAlumno('${alumno.dni}')">
                    <div class="student-info-mini">
                        <h4>${alumno.nombre}</h4>
                        <p>DNI: ${alumno.dni} | Ciclo: ${alumno.ciclo}</p>
                    </div>
                    ${stateBadge}
                </div>
            `;
        });
    }

    // Mostrar el contenedor animado
    contenedor.classList.remove('results-hidden');
    contenedor.classList.add('results-show');
}

// =========================================
// MOSTRAR DETALLE COMPLETO DEL ALUMNO
// =========================================
function seleccionarAlumno(dni) {
    // 1. Ocultar la previsualización de búsqueda
    const resultsContainer = document.getElementById('search-results-container');
    resultsContainer.classList.remove('results-show');
    resultsContainer.classList.add('results-hidden');
    
    // 2. Ocultar vista resumen
    document.getElementById('dashboard-summary').style.display = 'none';

    // 3. Buscar el alumno específico
    const alumno = baseDeDatosAlumnos.find(a => a.dni === dni);
    const detailSection = document.getElementById('student-detail-section');

    if (!alumno) {
        detailSection.innerHTML = "<p>Error: Alumno no encontrado.</p>";
        detailSection.style.display = 'block';
        return;
    }

    // 4. Construir la interfaz del detalle dinámicamente

    // Lógica para badge de estado
    const stateBadge = alumno.materiasAdeudadas.length > 0 
        ? '<span class="badge badge-danger">Cuenta con materias adeudadas</span>' 
        : '<span class="badge badge-success">Situación Académica: Al día</span>';

    // Construir Filas de Tabla de Notas con colores dinámicos
    let filasNotas = "";
    alumno.calificaciones.forEach(cal => {
        // Determinar color de la nota
        let colorClase = "grade-mid";
        if (cal.nota >= 7) colorClase = "grade-high";
        if (cal.nota < 6) colorClase = "grade-low";

        filasNotas += `
            <tr>
                <td>${cal.materia}</td>
                <td><span class="grade-circle ${colorClase}">${cal.nota}</span></td>
            </tr>
        `;
    });

    // Construir Lista de Materias Adeudadas
    let listaDeudas = "";
    if (alumno.materiasAdeudadas.length > 0) {
        alumno.materiasAdeudadas.forEach(mat => {
            listaDeudas += `<li><i class='bx bx-x-circle'></i> ${mat}</li>`;
        });
    } else {
        listaDeudas = '<p style="color:var(--success); font-size:14px;"><i class='+'bx bx-check-circle'+'></i> No posee materias adeudadas.</p>';
    }

    // INYECTAR TODO EL HTML AL CONTENEDOR DE DETALLE
    detailSection.innerHTML = `
        <div class="detail-header">
            <div>
                <h2>${alumno.nombre}</h2>
                <p style="color:var(--text-muted); font-size:14px;">DNI: ${alumno.dni} | Ciclo: ${alumno.ciclo}</p>
            </div>
            <div>
                ${stateBadge}
                <a href="#" class="action-btn btn-pdf" style="margin-left: 10px;">
                    <i class='bx bxs-file-pdf'></i> Descargar Boletín
                </a>
            </div>
        </div>

        <div class="detail-grids">
            <div class="info-card notes-section">
                <h3><i class='bx bx-list-check'></i> Calificaciones del Ciclo</h3>
                <table class="notes-table">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Nota Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasNotas}
                    </tbody>
                </table>
            </div>

            <div class="info-card debt-section">
                <h3><i class='bx bx-error-circle'></i> Materias Adeudadas</h3>
                <div class="debt-list">
                    <ul>
                        ${listaDeudas}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // 5. Mostrar la sección con la animación slideIn (definida en CSS)
    detailSection.style.display = 'block';
}