import os
import subprocess
import pandas as pd
from pymongo import MongoClient

# Configuración de la conexión a MongoDB
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "BibliotecaIISEC"

# Directorio donde se encuentran los scripts
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
SCRIPTS_DIR = os.path.join(base_path, 'backend', 'scripts')
EXCEL_FILE = os.path.join(SCRIPTS_DIR, "BASE_DE_DATOS_PUBLICACIONES_ IISEC.xlsx")

# Función para ejecutar todos los scripts
def run_scripts():
    scripts = [
        "articulosRutas.py",
        "capitulosRutas.py",
        "documentosRutas.py",
        "ideasYreflexionesRutas.py",
        "infoiisecRutas.py",
        "librosRutas.py",
        "policybriefRutas.py",
    ]

    for script in scripts:
        script_path = os.path.join(SCRIPTS_DIR, script)
        if os.path.exists(script_path):
            subprocess.run(["python", script_path], check=True)
        else:
            print(f"El script {script} no se encontró en {SCRIPTS_DIR}")

# Función para limpiar valores nulos o NaN
def clean_value(value, expected_type=str, default=""):
    """
    Limpia el valor, convierte al tipo esperado y maneja valores nulos o vacíos.
    :param value: Valor a limpiar
    :param expected_type: Tipo esperado del valor
    :param default: Valor por defecto si el valor está vacío o es inválido
    :return: Valor limpio y convertido al tipo esperado
    """
    try:
        if pd.isna(value) or value == "":
            return default
        return expected_type(value)
    except (ValueError, TypeError):
        return default

# Función para subir datos a MongoDB
def upload_to_mongo():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    # Leer el archivo Excel
    excel_data = pd.ExcelFile(EXCEL_FILE)

    collections = {
        "Libros": "Libros",
        "ArticulosRevistas": "Artículos en revistas",
        "CapitulosLibros": "Capítulos de libros",
        "DocumentosTrabajo": "Documentos de Trabajo",
        "IdeasReflexiones": "Ideas y Reflexiones",
        "InfoIISEC": "Info IISEC",
        "PoliciesBriefs": "Policy Brief",
    }

    for collection_name, sheet_name in collections.items():
        if sheet_name in excel_data.sheet_names:
            print(f"Procesando la hoja: {sheet_name}")
            df = excel_data.parse(sheet_name, header=2)
            collection = db[collection_name]

            for _, row in df.iterrows():
                document = {}
                if collection_name == "Libros":
                    document = {
                        "portada": clean_value(row.get("Portada", None), str, ""),
                        "anio_publicacion": clean_value(row.get("Año de publicación", None), int, 0),
                        "titulo": clean_value(row.get("Título del libro", None)),
                        "autores": [autor.strip() for autor in clean_value(row.get("Editores/compiladores/autor", ""), str).split(",")],
                        "editorial": clean_value(row.get("Editorial", None)),
                        "abstract": clean_value(row.get("Abstract", None), str, ""),
                        "link_pdf": clean_value(row.get("Link PDF", None), str, ""),
                        "direccion_archivo": clean_value(row.get("PATH", None), str, ""),
                        "eliminado": False,
                    }
                elif collection_name == "ArticulosRevistas":
                    document = {
                        "numero_identificacion": clean_value(row.get("N°", None), str),
                        "titulo": clean_value(row.get("Título del artículo", None)),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autor/es del artículo", ""), str).split(",")],
                        "nombre_revista": clean_value(row.get("Nombre de la Revista", None)),
                        "anio_revista": clean_value(row.get("Año de la revista", None), int, 0),
                        "editorial": clean_value(row.get("Editorial", None)),
                        "abstract": clean_value(row.get("Resumen", None), str, ""),
                        "link_pdf": clean_value(row.get("Link PDF", None), str, ""),
                        "direccion_archivo": clean_value(row.get("PATH", None), str, ""),
                        "eliminado": False,
                    }
                elif collection_name == "CapitulosLibros":
                    document = {
                        "numero_identificacion": clean_value(row.get("N°", None), str, ""),
                        "titulo_capitulo": clean_value(row.get("Título del capítulo", None)),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autor/es del capítulo", ""), str).split(",")],
                        "titulo_libro": clean_value(row.get("Título del libro", None)),
                        "editores": [editor.strip() for editor in clean_value(row.get("Editores", ""), str).split(",")],
                        "anio_publicacion": clean_value(row.get("Año del libro", None), int, 0),
                        "editorial": clean_value(row.get("Editorial", None)),
                        "link_pdf": clean_value(row.get("Link PDF", None), str, ""),
                        "direccion_archivo": clean_value(row.get("PATH", None), str, ""),
                        "eliminado": False,
                    }
                elif collection_name == "DocumentosTrabajo":
                    document = {
                        "numero_identificacion": clean_value(row.get("N°")),
                        "titulo": clean_value(row.get("Título")),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autores", "")).split(",")],
                        "anio_publicacion": clean_value(row.get("Año"), int, 0),
                        "abstract": clean_value(row.get("Abstract")),
                        "link_pdf": clean_value(row.get("Link PDF")),
                        "direccion_archivo": clean_value(row.get("PATH")),
                        "eliminado": False,
                    }
                elif collection_name == "IdeasReflexiones":
                    document = {
                        "titulo": clean_value(row.get("Título")),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autor/es", "")).split(",")],
                        "anio_publicacion": clean_value(row.get("Año"), int, 0),
                        "observaciones": clean_value(row.get("Observaciones")),
                        "link_pdf": clean_value(row.get("Link PDF")),
                        "direccion_archivo": clean_value(row.get("PATH")),
                        "eliminado": False,
                    }
                elif collection_name == "InfoIISEC":
                    document = {
                        "titulo": clean_value(row.get("Título")),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autor/es", "")).split(",")],
                        "anio_publicacion": clean_value(row.get("Año"), int, 0),
                        "observaciones": clean_value(row.get("Observaciones")),
                        "link_pdf": clean_value(row.get("Link PDF")),
                        "direccion_archivo": clean_value(row.get("PATH")),
                        "eliminado": False,
                    }
                elif collection_name == "PoliciesBriefs":
                    document = {
                        "titulo": clean_value(row.get("Título")),
                        "autores": [autor.strip() for autor in clean_value(row.get("Autor/es", "")).split(",")],
                        "anio_publicacion": clean_value(row.get("Año"), int, 0),
                        "mensaje_clave": clean_value(row.get("Mensaje clave")),
                        "link_pdf": clean_value(row.get("Link PDF")),
                        "direccion_archivo": clean_value(row.get("PATH")),
                        "eliminado": False,
                    }

                # Subir a MongoDB
                if document:
                    try:
                        collection.insert_one(document)
                    except Exception as e:
                        print(f"Error al insertar documento: {document}\nRazón: {e}")

    client.close()
    print("Subida completada.")

if __name__ == "__main__":
    try:
        print("Ejecutando scripts...")
        run_scripts()

        print("Subiendo datos a MongoDB...")
        upload_to_mongo()
    except Exception as e:
        print(f"Ocurrió un error: {e}")
