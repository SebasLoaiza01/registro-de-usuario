"use strict";
// Variables globales
let datos = [],
  indiceEditar,
  bandera = 0,
  datosLs;

// 1- Referencias de Elementos DOM
const referenciarElementosDom = () => {
  return {
    botonRegistrar: document.querySelector("#botonRegistrar"),
    botonMostrar: document.querySelector("#botonMostrar"),
    botonFiltrar: document.querySelector("#botonFiltrar"),
    botonEditar: document.querySelector(".icon-pencil"),
    inputNombre: document.querySelector("#inputNombre"),
    inputApellido: document.querySelector("#inputApellido"),
    inputTelefono: document.querySelector("#inputTelefono"),
    inputFiltro: document.querySelector("#inputFiltro"),
    tablaDatos: document.querySelector("#tablaDatos"),
    resultados: document.querySelector("#resultados"),
  };
};

// 2- Funcion para validar inputs Vacios
function hayInputsVacios() {
  // Array con los inputs del formulario
  const inputsArr = [inputNombre, inputApellido, inputTelefono];

  // Evaluo cuantos inputs estan vacios
  let cantidadInputsVacios = 0;
  inputsArr.forEach((input) => {
    if (input.value === "") {
      input.style.border = "1px solid red";
      cantidadInputsVacios++;
    } else {
      input.style.border = "";
    }
  });

  return cantidadInputsVacios !== 0; // true:inputs vacios, false:datos completos
}

// 3- Borrado de inputs
function borrarInputs() {
  inputNombre.value = "";
  inputApellido.value = "";
  inputTelefono.value = "";
}

// 4- Sweet Alert Exito
function sweetAlertExito(mensaje) {
  Swal.fire({
    position: "center",
    width: "300px",
    heightAuto: false,
    showConfirmButton: false,
    title: mensaje,
    background: "#ABEBC6",
    icon: "success",
    iconColor: "green",
    color: "green",
    timer: 2000,
  });
}

// 5- Sweet Alert Error
function sweetAlertError(mensaje) {
  Swal.fire({
    position: "center",
    width: "300px",
    heightAuto: false,
    showConfirmButton: false,
    title: mensaje,
    background: "#E6B0AA",
    icon: "error",
    iconColor: "red",
    color: "red",
    timer: 2000,
  });
}

// 6- Sweet Alert Confirmación
const sweetAlertConfirmacion = (mensaje, callback) => {
  Swal.fire({
    title: mensaje,
    position: "center",
    icon: "warning",
    iconColor: "#F39C12",
    background: "#F9E79F",
    width: "300px",
    heightAuto: false,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

// 7- Funcion para colocar en mayuscula inicial dato
function colocarMayusculaIniclal(texto) {
  return texto.charAt(0).toUpperCase() + texto.substr(1).toLowerCase();
}

// 8- Constructor de Objetos (registros)
function Contacto(nombre, apellido, telefono) {
  this.id = datos.length;
  this.nombre = nombre;
  this.apellido = apellido;
  this.telefono = telefono;
}

// 9- Logica del boton mostrar/ocultar
function logicaBotonMostrar() {
  if (datos.length > 0) {
    if (botonMostrar.textContent === "Mostrar") {
      resultados.classList.remove("ocultar");
      botonMostrar.textContent = "Ocultar";
    } else {
      resultados.classList.add("ocultar");
      botonMostrar.textContent = "Mostrar";
    }
  } else {
    botonMostrar.textContent = "Mostrar";
  }
}

// 10- Funcion que muestra datos registrados en la tabla
function mostrarDatos(array) {
  // creo filas e inserto datos en la tabla
  resultados.innerHTML = "";
  array.forEach((contacto) => {
    resultados.innerHTML += `
      <tr>
      <td>${contacto.id + 1}</td>
      <td>${contacto.nombre}</td>
      <td>${contacto.apellido}</td>
      <td class='celdaTelefono'>
        <div class="celdaTelefono__dato">
          ${contacto.telefono}
        </div>
        <div class="celdaTelefono__iconosSpan">
          <span class="icon-pencil"></span>
          <span class="icon-bin"></span>
        </div>
      </td>
      </tr>`;
  });
}

// 11- Funcion para buscar contactos por nombre en tiempo real
function filtrarContactos() {
  // Capturo palabra a filtrar
  let nombreAFiltrar = colocarMayusculaIniclal(inputFiltro.value);

  // Creo array con los datos filtrados
  let datosFiltrados = datos.filter((contacto) =>
    contacto.nombre.includes(nombreAFiltrar)
  );

  // si no hay datos a filtrar quita datos de la tabla y establece texto del boton
  if (datosFiltrados.length === 0) botonMostrar.textContent = "Mostrar";

  // si hay datos filtrados, los Muestra
  mostrarDatos(datosFiltrados);
}

// 12- Funcion que registra contactos
function registrarContacto() {
  // Si no hay inputs vacios procedo con el registro
  if (!hayInputsVacios()) {
    // Obtengo los valores de los Campos (desestructuro)
    const [nombre, apellido, telefono] = [
      colocarMayusculaIniclal(inputNombre.value),
      colocarMayusculaIniclal(inputApellido.value),
      inputTelefono.value,
    ];

    // Acciones si se edita un contacto (editar = 1, registrar = 0)
    if (bandera === 1) {
      // Agrego nuevos valores al objeto a editar
      datos[indiceEditar].nombre = nombre;
      datos[indiceEditar].apellido = apellido;
      datos[indiceEditar].telefono = telefono;

      // Actualizo cambios en Local Storage
      localStorage.setItem("datosLs", JSON.stringify(datos));

      // borro input de filtrado
      inputFiltro.value = "";

      // Muestro sweetAlert de Exito
      sweetAlertExito("Contacto Editado!!");

      // Cambio texto boton Registrar
      botonRegistrar.textContent = "Registrar";

      // Acciones si se registra un nuevo contacto (bandera = 0)
    } else {
      // Creo (instancio) el contacto (Objeto)
      const contacto = new Contacto(nombre, apellido, telefono);

      // Agrego el contacto al array datos
      datos.push(contacto);

      // Actualizo cambios en Local Storage
      localStorage.setItem("datosLs", JSON.stringify(datos));

      // Muestro sweetAlert de Exito
      sweetAlertExito("Contacto Creado!!");
    }

    // Reseteo bandera para habilitar nueos registros sin reescribir el editado
    bandera = 0;

    // Borro los inputs
    borrarInputs();

    // Muestro datos en la tabla
    mostrarDatos(datos);

    // Cambio texto boton mostrar/ocultar
    botonMostrar.textContent = "ocultar";
  } else {
    // Muestro sweet alert de error
    sweetAlertError("Faltan Datos!!");
  }
}

// 13- Funciones Editar y Eliminar por delegacion de Eventos
function delegarEventosTabla(e) {
  const elemento = e.target;

  // Confirmacion de Edicion de contacto
  if (elemento.classList.contains("icon-pencil")) {
    // Confirmacion de edicion de contacto
    sweetAlertConfirmacion("Editar contacto?", (respuesta) => {
      if (respuesta) {
        // Cambio texto boton Registrar
        botonRegistrar.textContent = "Editar";

        // se obtiene la fila que contiene el icono clickado
        const fila = e.target.closest("tr");

        // se obtienen los datos incluidos en la fila seleccionada
        indiceEditar =
          Number(fila.querySelector("td:nth-child(1)").textContent) - 1;
        const nombre = fila.querySelector("td:nth-child(2)").textContent;
        const apellido = fila.querySelector("td:nth-child(3)").textContent;
        const telefono = fila.querySelector(".celdaTelefono__dato").textContent;

        // Activo bandera para editar registros
        bandera = 1;

        // Se pasan los datos a los inputs para editarlos
        inputNombre.value = nombre;
        inputApellido.value = apellido;
        inputTelefono.value = Number(telefono);
      }
    });

    // Funcionalidad Eliminar Contacto
  } else if (elemento.classList.contains("icon-bin")) {
    // Confirmacion de borrado del contacto
    sweetAlertConfirmacion("Eliminar contacto?", (respuesta) => {
      if (respuesta) {
        // se obtiene la fila que contiene el span clickado
        const fila = e.target.closest("tr");

        // Se obtiene el indice del contacto a eliminar
        indiceEditar = fila.querySelector("td:nth-child(1)").textContent - 1;

        // Elimino contacto del array de datos
        datos.splice(indiceEditar, 1);

        // Actualizo cambios en Local Storage
        localStorage.setItem("datosLs", JSON.stringify(datos));

        // Mensaje de confirmacion exitosa de borrado
        sweetAlertExito("Contacto Eliminado!!");

        // reseteo bandera para evitar sobreescritura con nuevos registros
        bandera = 0;

        // Borro input de busqueda
        inputFiltro.value = "";

        // Reestructuro los indices del array de datos
        datos.forEach((contacto, index) => {
          contacto.id = index;
        });

        // Verifico si quedan datos despues de borrar contacto
        if (datos.length === 0) botonMostrar.textContent = "Mostrar";

        // Mostrar datos
        mostrarDatos(datos);
      }
    });
  }
}

// 14- Configuracion del local Storage
function configurarLocalStorage() {
  // Verifico disponibilidad en el navegador
  if (typeof localStorage === "undefined") {
    console.log("Local strage no disponible...");
  } else {
    console.log("Local storage disponible...");
    // confirmo existencia de variable datosLs en Local Storage
    if (localStorage.getItem("datosLs") === null) {
      console.log("datosLs no existe en Local Storage...");
      // Si no existe, creo la variable datosLs
      localStorage.setItem("datosLs", JSON.stringify([]));
    } else {
      console.log("datosLs existe en Local storage...");
      // Carga inicial de datos
      datos = [...JSON.parse(localStorage.getItem("datosLs"))];
      if (datos.length > 0) {
        botonMostrar.textContent = "Ocultar";
      } else {
        botonMostrar.textContent = "Mostrar";
      }
      mostrarDatos(datos);
    }
  }
}

// 15- Exporto todos los elementos
export {
  datos,
  referenciarElementosDom,
  logicaBotonMostrar,
  registrarContacto,
  mostrarDatos,
  filtrarContactos,
  delegarEventosTabla,
  configurarLocalStorage,
};
