use BibliotecaIISEC;

db.createCollection("Usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuario","nombre", "contrasenia", "theme"],
      properties: {
        usuario: {
          bsonType: "string",
          description: "Su nombre de usuario para hacer login"
        },
        nombre: {
          bsonType: "string",
          description: "nombre del propietario de la cuenta"
        },
        contrasenia: {
          bsonType: "string",
          description: "Debe ser su contrasenia que utilizaran para hacer login"
        },
        theme: {
          bsonType: "int",
          description: "Debe ser el codigo del tema que estan utilizando en su perfil"
        },
      }
    }
  }
});

db.createCollection("Libros", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["portada", "anio_publicacion", "titulo", "autores"],
      properties: {
        portada: {
          bsonType: "string",
          description: "Debe ser una URL válida para la imagen de la portada"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser un número entero representando el año de publicación"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del libro"
        },
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores o compiladores"
        },
        editorial: {
          bsonType: "string",
          description: "Debe ser el nombre de la editorial del libro"
        },
        abstract: {
          bsonType: "string",
          description: "Debe ser un breve resumen o descripción del libro (opcional)"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del libro"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});



db.createCollection("ArticulosRevistas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "autores", "nombre_revista", "anio_revista"],
      properties: {
        numero_articulo: {
          bsonType: "string",
          description: "Debe ser el número o identificación del artículo"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del artículo"
        },
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores del artículo"
        },
        nombre_revista: {
          bsonType: "string",
          description: "Debe ser el nombre de la revista donde fue publicado"
        },
        anio_revista: {
          bsonType: "int",
          description: "Debe ser el año en que fue publicado el artículo"
        },
        editorial: {
          bsonType: "string",
          description: "Debe ser el nombre de la editorial de la revista"
        },
        abstract: {
          bsonType: "string",
          description: "Debe ser un breve resumen o descripción del libro (opcional)"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del artículo"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("CapitulosLibros", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo_libro", "titulo_capitulo", "autores", "anio_publicacion"],
      properties: {
        numero_identificacion: {
          bsonType: "string",
          description: "Identificador del capítulo de libro"
        },
        titulo_capitulo: {
          bsonType: "string",
          description: "Debe ser el título del capítulo"
        },
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores del capítulo"
        },
        titulo_libro: {
          bsonType: "string",
          description: "Debe ser el título del libro"
        },
        editores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de editores del capítulo"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser el año de publicación del capítulo"
        },
        editorial: {
          bsonType: "string",
          description: "Debe ser el nombre de la editorial"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del capítulo"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("DocumentosTrabajo", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "autores", "anio_publicacion"],
      properties: {
        numero_identificacion: {
          bsonType: "string",
          description: "Identificador del documento de trabajo"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del documento de trabajo"
        },
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser el año de publicación del documento"
        },
        abstract: {
          bsonType: "string",
          description: "Debe ser un breve resumen o descripción del libro (opcional)"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del documento"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("IdeasReflexiones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "autores", "anio_publicacion"],
      properties: {
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser el año de publicación del documento"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del documento de trabajo"
        },      
        observaciones: {
          bsonType: "string",
          description: "Debe contener las observaciones del documento"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del documento"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("PoliciesBriefs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "autores", "anio_publicacion"],
      properties: {
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser el año de publicación del documento"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del documento de trabajo"
        },      
        mensaje_clave: {
          bsonType: "string",
          description: "Debe contener el mensaje clave del documento"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del documento"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("InfoIISEC", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "autores", "anio_publicacion"],
      properties: {
        autores: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Debe ser un arreglo de autores"
        },
        anio_publicacion: {
          bsonType: "int",
          description: "Debe ser el año de publicación del documento"
        },
        titulo: {
          bsonType: "string",
          description: "Debe ser el título del documento de trabajo"
        },      
        observaciones: {
          bsonType: "string",
          description: "Debe contener las observaciones del documento"
        },
        link_pdf: {
          bsonType: "string",
          description: "Debe ser una URL válida al PDF del documento"
        },
        direccion_archivo: {
          bsonType: "string",
          description: "Es la dirección donde se encuentra almacenado el archivo"
        }
      }
    }
  }
});

db.createCollection("Logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_usuario", "accion", "fecha"],
      properties: {
        id_usuario: {
          bsonType: "objectId",  // Para que sea referenciable a la colección de Usuarios
          description: "ID del usuario que realizó la acción"
        },
        id_documento: {
          bsonType: "objectId",  // Para que sea referenciable a cualquier documento de otra colección
          description: "ID del documento en cualquier otra colección sobre el cual se realizó la acción"
        },
        accion: {
          bsonType: "string",
          description: "Descripción de la acción realizada (crear, actualizar, eliminar, etc.)"
        },
        fecha: {
          bsonType: "date",
          description: "Fecha y hora en que se realizó la acción"
        }
      }
    }
  }
});

/* INDEXES */

db.Libros.createIndex({ titulo: 1 })
db.Libros.createIndex({ autores: 1 })
db.Libros.createIndex({ anio_publicacion: 1 })

db.ArticulosRevistas.createIndex({ titulo: 1 })
db.ArticulosRevistas.createIndex({ autores: 1 })
db.ArticulosRevistas.createIndex({ anio_revista: 1 })
db.ArticulosRevistas.createIndex({ nombre_revista: 1 })

db.CapitulosLibros.createIndex({ titulo_libro: 1 })
db.CapitulosLibros.createIndex({ titulo_capitulo: 1 })
db.CapitulosLibros.createIndex({ autores: 1 })
db.CapitulosLibros.createIndex({ anio_publicacion: 1 })

db.DocumentosTrabajo.createIndex({ titulo: 1 })
db.DocumentosTrabajo.createIndex({ autores: 1 })
db.DocumentosTrabajo.createIndex({ anio_publicacion: 1 })

db.Usuarios.createIndex({ usuario: 1 }, { unique: true }) // Para garantizar unicidad
db.Usuarios.createIndex({ nombre: 1 })
