const apiURL = "url backend"; //versel

async function enviarDatosFormulario() {
    const form = document.getElementById("idFormulario"); //sacamos valores html 
    const datosFormulario = new FormData(form);
    const datosConvertidos = new URLSearchParams(datosFormulario).toString();

    //peticion al backend
    let respuesta = await fetch(apiURL + "/contacts/guardar", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: datosConvertidos
    });
    respuesta = await respuesta.json();
    alert(respuesta.message);
}