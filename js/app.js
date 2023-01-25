// Variables ***********
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");
//UI
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");
let editando;

class Citas {
    constructor () {
        this.citas = [];
    }
    agregarCita (cita) {
        this.citas = [ ...this.citas, cita ];
    }
    eliminarCita (id) {
        this.citas = this.citas.filter(citas => citas.id !== id);
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}
class UI {
    imprimirAlerta (mensaje, tipo) {
        const divMensaje = document.createElement("div");
        divMensaje.className = "text-center alert d-block col-12";

        if (tipo === 'error') {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        divMensaje.textContent = mensaje;

        //agreagar al DOM seleccionamos el id del padre e insertamos (elemmento a insertar, elemento anterior al que insertamos)
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    //destructuramos citas para entrar directamente al arreglo
    imprimirCitas ({ citas }) {
        this.limpiarHTML();
        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement("div");
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;
            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${ propietario }
            `;
            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono: </span> ${ telefono }
            `;
            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span> ${ fecha }
            `;
            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora: </span> ${ hora }
            `;
            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Síntomas: </span> ${ sintomas }
            `;
            //Botón eliminar cita
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mr-2");
            btnEliminar.innerHTML = 'Eliminar <img src="img/remove.svg" width="20" height="20">';
            btnEliminar.onclick = () => eliminarCita(id);
            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-info", "mr-2");
            btnEditar.innerHTML = 'Editar <img src="img/edit.svg" width="20" height="20">';
            btnEditar.onclick = () => administradorCita(cita);

            //Agregamos los parrafos a divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);            //Agregamos las citas al HTML
            divCita.appendChild(btnEditar);
            contenedorCitas.appendChild(divCita);


        });
    }
    limpiarHTML () {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}
const ui = new UI();
const administrarCitas = new Citas();

//Registro de eventos
eventListeners();
function eventListeners () {
    //Métodos de entrada change coge el elemento entero cuando cambia
    // input lo muestra cada vez que introduces una letra
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);
    formulario.addEventListener("submit", nuevaCita);

}
//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}
//Agrega datos al objeto de cita
function datosCita (e) {
    //Accedemos dentro del objeto a la propiedad name
    //el elemento html debe tener la propiedad name="mascota", name="propietario",etc
    citaObj[ e.target.name ] = e.target.value;
}
//Valida y agreda una nueva cita a la clase citas
function nuevaCita (e) {
    e.preventDefault();

    //Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
    //Validaciones

    if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
        ui.imprimirAlerta('Todos los campos son obligatorios');
        return;
    }
    if (editando){
        ui.imprimirAlerta("Se editó correctamente");
        administrarCitas.editarCita({ ...citaObj });
        formulario.querySelector('button[type="submit"]').textContent = "Crear cita";
        editando= false;


    }else{
        //Agregar un id único por medio de date
        citaObj.id = Date.now();

        //agregamos una copia del objeto
        administrarCitas.agregarCita({ ...citaObj });
        ui.imprimirAlerta("Se agregó correctamente");
    }
    

    //Reiniciar el formulario 
    formulario.reset();
    reiniciarObjeto();

    //Mostrar HTML de las citas
    ui.imprimirCitas(administrarCitas);
}
function reiniciarObjeto () {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}
function eliminarCita (id) {
    //Eliminar cita
    administrarCitas.eliminarCita(id);
    //Mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente')
    //Refrescar cita
    ui.imprimirCitas(administrarCitas);
}
function administradorCita(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas,id } = cita;
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = "Guardar cambios";
    editando = true;

}