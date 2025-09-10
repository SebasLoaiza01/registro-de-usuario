// Activar modo estricto
"use strict";

// Importar elementos desde el módulo
import * as libreria from "./libreria.js";

// ------------------------------------------------------------------
// PROGRAMA PRINCIPAL
// ------------------------------------------------------------------

// Configuración inicial y carga de datos desde Local Storage
libreria.configurarLocalStorage();

// Registro de usuarios
botonRegistrar.addEventListener("click", libreria.registrarContacto);

// Mostrar/Ocultar Datos
botonMostrar.addEventListener("click", libreria.logicaBotonMostrar);

// Búsqueda por nombre en tiempo real
inputFiltro.addEventListener("input", libreria.filtrarContactos);

// Delegación de eventos en la tabla (Editar y Eliminar)
tablaDatos.addEventListener("click", libreria.delegarEventosTabla);
