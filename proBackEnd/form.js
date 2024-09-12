
//Funcion registro de usuarios
async function enviarDatosFormulario() {
    
    const form = document.getElementById('registroR');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    
    if (data.contraseña !== data.confContraseña) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        // Envía los datos al backend
        const response = await fetch('http://localhost:5000/api/clientes/add', { //POSIBLE CAMBIO
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verifica la respuesta del servidor
        if (response.ok) {
            const result = await response.json();
            console.log('Usuario registrado con éxito:', result);
            alert('Usuario registrado con éxito');
            // Redirigir a otra página
            window.location.href = '/home/usuario/mi-primer-anime/index.html'; //POSIBLE CAMBIO
        } else {
            const error = await response.text();
            console.error('Error al registrar usuario:', error);
            alert('Error al registrar usuario: ' + error);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red: ' + error);
    }
}

//Funcion login 

async function loginEnviarDatosFormulario() {
  
    const form = document.getElementById('formulario');

    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        
        const response = await fetch('http://localhost:5000/api/clientes/login');

       
        if (response.ok) {
            const result = await response.json();
            console.log('Inicio de sesión exitoso:', result);
            alert('Inicio de sesión exitoso');
            // Redirigir a otra página
            window.location.href = '/home/usuario/mi-primer-anime/index.html'; //POSIBLE CAMBIO
        } else {
            const error = await response.text();
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión: ' + error);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red: ' + error);
    }
}

//Funcion para enviar datos de los animes

async function enviarDatosFormularioAnime() {

    const form = document.getElementById('formulario');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.nombre_Jp) {
        alert("El nombre en japonés es obligatorio desde el form"); //CAMBIO
        return;
    }

    try {
        // Envía los datos al backend
        const response = await fetch('http://localhost:5000/api/clientes/addAnime', { //POSIBLE CAMBIO
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verifica la respuesta del servidor
        if (response.ok) {
            const result = await response.json();
            console.log('Anime registrado con éxito:', result);
            alert('Anime registrado con éxito');
            resetFormulario();
            // Redirigir a otra página
            //window.location.href = '/home/usuario/mi-primer-anime/index.html'; //POSIBLE CAMBIO
        } else {
            const error = await response.text();
            console.error('Error al registrar el anime:', error);
            alert('Error al registrar el anime: ' + error);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red: ' + error);
    }

}

function resetFormulario() {
    const formulario = document.getElementById('formulario');
    formulario.reset();
}
