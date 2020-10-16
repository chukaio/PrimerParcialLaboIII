var request = new XMLHttpRequest();

var nombreToModify;
var cuatrimestreToModify;
var fechaFinalToModify;
var turnoToModify;

function stringToJSON(val) {
    return JSON.parse(val);
}

function JSONToString(val) {
    return JSON.stringify(val);
}

function endPoint(verb, route, params, callback) {
    if (verb === "GET") {
        request.onreadystatechange = callback;
        request.open(verb, route + params, true);
        request.send();
    } else if (verb === "POST") {
        request.onreadystatechange = callback;
        request.open(verb, route, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(params);
    }
}

function formatDate(date, splitBy, printBy) {
    var dateAux = date.split(splitBy);

    return dateAux[2] + printBy + dateAux[1] + printBy + dateAux[0];
}

function fillForm(e) {
    var nombre = e.target.parentNode.firstElementChild.textContent;
    var cuatrimestre = e.target.parentNode.firstElementChild.nextElementSibling.textContent;
    var fechaFinal = e.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.textContent;
    var turno = e.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
    var formNombre = document.getElementById("fname");
    var formCuatrimestre = document.getElementById("fcuatrimestre");
    var formFechaFinal = document.getElementById("lFechaFinal");
    var formTurno = document.getElementsByName("Turno");
    var rowForm = document.getElementById("rowFromForm");
    var cuatrimestreComboBox = document.getElementById("fcuatrimestre");
    rowForm.rowId = e.target.parentNode.id;
    formNombre.value = nombre;
    formCuatrimestre.value = cuatrimestre;
    formFechaFinal.value = formatDate(fechaFinal, "/", "-");
    if (turno == "Mañana") {
        formTurno[0].checked = true;
        formTurno[1].checked = false;
    } else if (turno == "Noche") {
        formTurno[0].checked = false;
        formTurno[1].checked = true;
    }
    formTurno.value = turno;
    containerForm.hidden = false;
    cuatrimestreComboBox.disabled = true;
}

function callbackServerFillTable() {
    var materiasJSON;
    var tbody = document.getElementById("tblBody");
    var tr;
    var tdNombre;
    var tdCuatrimestre;
    var tdFechaFinal;
    var tdTurno;
    var txtNombre;
    var txtCuatrimestre;
    var txtFechaFinal;
    var txtTurno;

    if (request.readyState === 4) {
        if (request.status === 200) {
            spinner.hidden = true;
            materiasJSON = stringToJSON(request.responseText);
            for (let i = 0; i < materiasJSON.length; i++) {
                tr = document.createElement("tr");
                tdNombre = document.createElement("td");
                tdCuatrimestre = document.createElement("td");
                tdFechaFinal = document.createElement("td");
                tdTurno = document.createElement("td");
                txtNombre = document.createTextNode(materiasJSON[i].nombre);
                txtCuatrimestre = document.createTextNode(materiasJSON[i].cuatrimestre);
                txtFechaFinal = document.createTextNode(materiasJSON[i].fechaFinal);
                txtTurno = document.createTextNode(materiasJSON[i].turno);
                tdNombre.appendChild(txtNombre);
                tdCuatrimestre.appendChild(txtCuatrimestre);
                tdFechaFinal.appendChild(txtFechaFinal);
                tdTurno.appendChild(txtTurno);
                tr.appendChild(tdNombre);
                tr.appendChild(tdCuatrimestre);
                tr.appendChild(tdFechaFinal);
                tr.appendChild(tdTurno);
                tr.addEventListener("dblclick", fillForm);
                tr.setAttribute("id", materiasJSON[i].id);
                tbody.appendChild(tr);
            }
        }
    }
}

function clearImputs() {
    var nombre = document.getElementById("fname");
    var cuatrimestre = document.getElementById("fcuatrimestre");
    var fechaFinal = document.getElementById("lFechaFinal");
    var turno = document.getElementsByName("Turno");

    nombre.value = "";
    cuatrimestre.value = "1";
    fechaFinal.value = "";
    turno.value = "";
}

function closeForm() {
    var containerForm = document.getElementById("containerForm");

    containerForm.hidden = true;
    clearImputs();
    resetClass();
}

function formatParams(verb, element1, element2, element3, element4) {
    var rowForm = document.getElementById("rowFromForm");

    if (verb === "GET") {
        return "?usr=" + element1.value + "&pass=" + element2.value;
    } else if (verb === "POST") {
        if (element2 == undefined) {
            var rtn = {
                nombre: element1.value,
                fechaFinal: element3.value,
                turno: undefined
            }
        } else {
            var rtn = {
                id: rowForm.rowId,
                nombre: element1.value,
                cuatrimestre: element2.value,
                fechaFinal: element3.value,
                turno: undefined
            }
        }
        if (element4[0].checked == true) {
            rtn.turno = "Mañana";
        } else if (element4[1].checked == true) {
            rtn.turno = "Noche";
        }

        return JSONToString(rtn);
    }
}

function callbackServerModificar() {
    if (request.readyState === 4) {
        if (request.status === 200) {
            var rowForm = document.getElementById("rowFromForm");
            var body = document.getElementById("tblBody");
            var idToModify = rowForm.rowId;
            var rows = body.rows;

            for (let index = 0; index < rows.length; index++) {
                if (rows[index].id == idToModify) {
                    rows[index].firstElementChild.textContent = nombreToModify;
                    rows[index].firstElementChild.nextElementSibling.textContent = cuatrimestreToModify;
                    rows[index].firstElementChild.nextElementSibling.nextElementSibling.textContent = formatDate(fechaFinalToModify, "-", "/");
                    rows[index].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent = turnoToModify;
                }
            }
            spinner.hidden = true;
            alert("Modificado exitosamente!");
        }
    }
}

function callbackServerEliminar() {
    if (request.readyState === 4) {
        if (request.status === 200) {
            var rowForm = document.getElementById("rowFromForm");
            var body = document.getElementById("tblBody");
            var idToModify = rowForm.rowId;
            var rows = body.rows;

            for (let index = 0; index < rows.length; index++) {
                if (rows[index].id == idToModify) {
                    rows[index].remove();
                }
            }
            spinner.hidden = true;
            alert("Borrado exitosamente!");
        }
    }
}

function modificar() {
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var nombre = document.getElementById("fname");
    var cuatrimestre = document.getElementById("fcuatrimestre");
    var fechaFinal = document.getElementById("lFechaFinal");
    var turno = document.getElementsByName("Turno");
    var verb = "POST";
    var route = "http://localhost:3000/editar";
    var params;

    if (nombre.value.length >= 6 && cuatrimestre.disabled == true && !isDateLessThanToday(fechaFinal.value) && (turno.value === "Mañana" || turno.value === "Noche")) {
        nombreToModify = nombre.value;
        cuatrimestreToModify = cuatrimestre.value;
        fechaFinalToModify = fechaFinal.value;
        if (turno[0].checked == true) {
            turnoToModify = "Mañana";
        } else if (turno[1].checked == true) {
            turnoToModify = "Noche";
        }
        resetClass();
        containerForm.hidden = true;
        params = formatParams(verb, nombre, undefined, fechaFinal, turno);
        endPoint(verb, route, params, callbackServerModificar);
    } else {
        if (nombre.value.length < 6) {
            nombre.className = "Error";
        }
        if (isDateLessThanToday(fechaFinal.value)) {
            fechaFinal.className = "Error";
        }
        spinner.hidden = true;
    }
}

function resetClass() {
    var nombre = document.getElementById("fname");
    var fechaFinal = document.getElementById("lFechaFinal");

    nombre.className = "sinError";
    fechaFinal.className = "sinError";
}

function borrar() {
    containerForm.hidden = true;
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var nombre = document.getElementById("fname");
    var cuatrimestre = document.getElementById("fcuatrimestre");
    var fechaFinal = document.getElementById("lFechaFinal");
    var turno = document.getElementsByName("Turno");
    var verb = "POST";
    var route = "http://localhost:3000/eliminar";
    var params;

    params = formatParams(verb, nombre, cuatrimestre, fechaFinal, turno);
    endPoint(verb, route, params, callbackServerEliminar);

}

function isDateLessThanToday(val) {
    var today = new Date();
    var dateVal = new Date(val);
    var rtn = false;

    if (dateVal < today) {
        rtn = true;
    }

    return rtn;
}

function fillTable() {
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var verb = "GET";
    var route = "http://localhost:3000/materias";

    endPoint(verb, route, "", callbackServerFillTable);
}

function addListeners() {
    var btnModificar = document.getElementById("btnModificar");
    var btnClose = document.getElementById("btnClose");
    var btnEliminate = document.getElementById("btnEliminate");
    var nombre = document.getElementById("fname");
    var fechaFinal = document.getElementById("lFechaFinal");

    btnModificar.addEventListener("click", modificar);
    btnClose.addEventListener("click", closeForm);
    btnEliminate.addEventListener("click", borrar);
    nombre.addEventListener("click", resetClass);
    fechaFinal.addEventListener("click", resetClass);
}

function init() {
    var containerForm = document.getElementById("containerForm");

    containerForm.hidden = true;
    addListeners();
    fillTable();
}