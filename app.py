from flask import Flask, jsonify, render_template
import json
import os

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

JSON_FILE = os.path.join("data", "escuela.json")


def cargar_datos():
    if not os.path.exists(JSON_FILE):
        return {}

    with open(JSON_FILE, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/api/cursos")
def obtener_cursos():

    datos = cargar_datos()

    cursos = list(datos.keys())

    return jsonify(cursos)


@app.route("/api/curso/<curso>")
def obtener_alumnos(curso):

    datos = cargar_datos()

    if curso not in datos:
        return jsonify([])

    alumnos = []

    for alumno in datos[curso]["alumnos"]:

        alumnos.append({
            "id": alumno["id"],
            "nombre": alumno["nombre"]
        })

    return jsonify(alumnos)


@app.route("/api/alumno/<curso>/<id_alumno>")
def obtener_alumno(curso, id_alumno):

    datos = cargar_datos()

    if curso not in datos:
        return jsonify({
            "error": "Curso no encontrado"
        }), 404

    for alumno in datos[curso]["alumnos"]:

        if str(alumno["id"]) == str(id_alumno):
            return jsonify(alumno)

    return jsonify({
        "error": "Alumno no encontrado"
    }), 404


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )