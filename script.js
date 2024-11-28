// Función para validar el login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var loginMessage = document.getElementById('loginMessage');

    if (username === 'USER' && password === 'PASS') {
        loginMessage.textContent = "¡Ingreso exitoso!";
        loginMessage.style.color = "#28a745"; // Verde para éxito
        window.location.href = 'pagina-principal.html'; // Redirección directa
        // Guardar el nombre de usuario en el almacenamiento local para usar en la página principal
        localStorage.setItem('username', username);

        // Enviar correo con EmailJS
        sendLoginEmail(username);

        // Redirigir a la página principal de inmediato
        
    } else {
        loginMessage.textContent = "Usuario o contraseña incorrectos.";
        loginMessage.style.color = "#dc3545"; // Rojo para error
    }
});

// Función para enviar el correo con el nombre de usuario
function sendLoginEmail(username) {
    emailjs.send("service_xxx", "template_xxx", {
        username: username,
        message: "El usuario " + username + " ha ingresado a la página web."
    }).then(function(response) {
        console.log("Correo enviado: ", response);
    }, function(error) {
        console.log("Error al enviar correo: ", error);
    });
}

// Mostrar el nombre de usuario en la página principal
window.onload = function() {
    var userName = localStorage.getItem('username');
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }
};

// === Funciones de la Página Principal (3 APIs) ===

// Función para enviar correo usando EmailJS
function sendEmail(event) {
    event.preventDefault(); // Evita el envío estándar del formulario

    // Captura los datos del formulario
    const to_email = document.getElementById("to_email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Configura los parámetros para EmailJS
    const params = {
        to_email: to_email,
        subject: subject,
        message: message,
    };

    // Enviar el correo con EmailJS
    emailjs.send("service_3b29alp", "template_a8a29b5", params)
        .then(() => {
            alert(`Correo enviado exitosamente a: ${to_email}`);
            document.getElementById("emailForm").reset(); // Limpia el formulario
        })
        .catch(error => {
            alert("Error al enviar el correo. Intenta nuevamente.");
            console.error("Error al enviar el correo:", error);
        });
}

// Función para cargar imágenes desde Unsplash
function fetchImagesFromUnsplash() {
    const accessKey = "gLFbpB0lLP_CJovVvD8pT3cvmA3lPHe7MkMDsVhrkAc"; // Reemplaza con tu clave de Unsplash
    const url = `https://api.unsplash.com/photos?client_id=${accessKey}&per_page=6`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const gallery = document.getElementById("gallery");
            gallery.innerHTML = ""; // Limpia las imágenes anteriores
            data.forEach(image => {
                const img = document.createElement("img");
                img.src = image.urls.small;
                img.alt = image.alt_description || "Imagen de Unsplash";
                img.classList.add("gallery-img");
                gallery.appendChild(img);
            });
        })
        .catch(error => {
            console.error("Error al cargar imágenes:", error);
            document.getElementById("gallery").innerHTML = `
                <p>Error al cargar las imágenes. Por favor, verifica tu conexión o clave de acceso.</p>
            `;
        });
}

// Función para cargar cotizaciones
function cargarCotizaciones() {
    const url = "https://cdn.jsdelivr.net/gh/sistemasaguila/cotizaciones-set@main/data/latest.json";
    const cotizacionesContainer = document.getElementById('cotizaciones-container');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cotizacionesContainer.innerHTML = ''; // Limpia el contenido anterior

            // Iterar sobre las fechas (ejemplo: "2022-03-23")
            Object.keys(data).forEach(fecha => {
                // Crear un encabezado para la fecha
                const fechaHeader = document.createElement('h3');
                fechaHeader.textContent = `Cotizaciones del ${fecha}`;
                fechaHeader.classList.add('fecha-cotizacion');
                cotizacionesContainer.appendChild(fechaHeader);

                // Iterar sobre las monedas dentro de la fecha (ejemplo: "usd", "brl")
                Object.keys(data[fecha]).forEach(moneda => {
                    const valores = data[fecha][moneda];

                    // Crear un div para cada cotización
                    const cotizacionDiv = document.createElement('div');
                    cotizacionDiv.classList.add('cotizacion');

                    // Añadir contenido para compra y venta
                    cotizacionDiv.innerHTML = `
                        <span class="moneda">${moneda.toUpperCase()}</span>
                        <div class="valores">
                            <p class="compra">Compra: ${valores.purchase}</p>
                            <p class="venta">Venta: ${valores.sale}</p>
                        </div>
                    `;
                    cotizacionesContainer.appendChild(cotizacionDiv);
                });
            });
        })
        .catch(error => {
            console.error("Error al cargar cotizaciones:", error);
            cotizacionesContainer.innerHTML = `
                <p>Error al cargar las cotizaciones. Por favor, intenta nuevamente.</p>
            `;
        });
}
