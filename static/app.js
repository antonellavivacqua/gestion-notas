const cursosDiv = document.getElementById("cursos");
const alumnosDiv = document.getElementById("alumnos");
const detalleDiv = document.getElementById("detalle");

async function cargarCursos() {

    const response = await fetch("/api/cursos");
    const cursos = await response.json();

    cursosDiv.innerHTML = "<h2>Cursos</h2>";

    const grupos = {
        "📚 Ciclo Básico": [],
        "💻 Computación": [],
        "🔧 Automotor": [],
        "📁 Otros": []
    };

    cursos.forEach(curso => {

        const nombre = curso.toUpperCase();

        // 1° y 2°
        if (
            nombre.startsWith("1°") ||
            nombre.startsWith("2°")
        ) {
            grupos["📚 Ciclo Básico"].push(curso);
        }

        // Cursos con orientación Computación
        else if (nombre.includes("C")) {
            grupos["💻 Computación"].push(curso);
        }

        // Cursos con orientación Automotor
        else if (nombre.includes("A")) {
            grupos["🔧 Automotor"].push(curso);
        }

        else {
            grupos["📁 Otros"].push(curso);
        }
    });

    for (const categoria in grupos) {

        if (grupos[categoria].length === 0)
            continue;

        const titulo = document.createElement("div");

        titulo.className = "categoria";

        titulo.textContent = categoria;

        cursosDiv.appendChild(titulo);

        grupos[categoria].forEach(curso => {

            const boton = document.createElement("button");

            boton.className = "curso-btn";

            boton.textContent = curso;

            boton.onclick = () => cargarAlumnos(curso);

            cursosDiv.appendChild(boton);
        });
    }
}

async function cargarAlumnos(curso) {

    const response =
        await fetch(`/api/curso/${encodeURIComponent(curso)}`);

    const alumnos = await response.json();

    alumnosDiv.innerHTML = `
        <h2>${curso}</h2>
    `;

    detalleDiv.innerHTML =
        "<h2>Seleccione un alumno</h2>";

    alumnos.forEach(alumno => {

        const item = document.createElement("div");

        item.className = "alumno-item";

        item.textContent = alumno.nombre;

        item.onclick = () =>
            cargarAlumno(curso, alumno.id);

        alumnosDiv.appendChild(item);
    });
}

async function cargarAlumno(curso, idAlumno) {

    const response =
        await fetch(`/api/alumno/${encodeURIComponent(curso)}/${idAlumno}`);

    const alumno = await response.json();

    let html = `
        <h2>${alumno.nombre}</h2>

        <p>
            <strong>N°:</strong>
            ${alumno.id}
        </p>

        <p>
            <strong>Materias pendientes:</strong>
            ${alumno.pendientes || "Ninguna"}
        </p>
    `;

    for (const materia in alumno.materias) {

        const m = alumno.materias[materia];

        html += `
            <div class="materia-card">

                <h3>${materia}</h3>

                <table class="tabla-notas">

                    <thead>

                        <tr>
                            <th colspan="3" class="grupo-cuatrimestre">
                                1° Cuatrimestre
                            </th>

                            <th colspan="3" class="grupo-cuatrimestre">
                                2° Cuatrimestre
                            </th>

                            <th colspan="3" class="grupo-cierres">
                                Cierres
                            </th>
                        </tr>

                        <tr>

                            <th>1° Bim</th>
                            <th>2° Bim</th>
                            <th>Nota Cuat.</th>

                            <th>3° Bim</th>
                            <th>4° Bim</th>
                            <th>Nota Cuat.</th>

                            <th>1°</th>
                            <th>2°</th>
                            <th>3°</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>${m.primer_bimestre ?? ""}</td>
                            <td>${m.segundo_bimestre ?? ""}</td>
                            <td>${m.nota_primer_cuatrimestre ?? ""}</td>

                            <td>${m.tercer_bimestre ?? ""}</td>
                            <td>${m.cuarto_bimestre ?? ""}</td>
                            <td>${m.nota_segundo_cuatrimestre ?? ""}</td>

                            <td>${m.primer_cierre ?? ""}</td>
                            <td>${m.segundo_cierre ?? ""}</td>
                            <td>${m.tercer_cierre ?? ""}</td>

                        </tr>

                    </tbody>

                </table>

            </div>
        `;
    }

    detalleDiv.innerHTML = html;
}

cargarCursos();