let respostaApi = [];


/**
 * Funció per a obtenir consells des de l'API
 */
const obtenerConsejosDesdeAPI = () => {
    fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => {
            console.log('Datos de la API:', data); // Agrega este console.log
            if (data && data.slip) {
                respostaApi = [data.slip];
                mostrarTarjetasConsejos();
            } else {
                alert('No es va poder obtindre resposta de la API de consells.');
            }
        })
        .catch(error => {
            console.error('Error al obtindre els consells: ', error);
        });
}

/**
 * Funció per a mostrar les targetes amb els consells
 */
const mostrarTarjetasConsejos = () => {
    const contenedorTarjetas = document.getElementById('tarjetasContainer');
    contenedorTarjetas.innerHTML = '';

    respostaApi.forEach(consejo => {

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

        const contenido = document.createElement('div');
        contenido.className = 'contenido';

        const atributos = ['advice'];

        for (let i = 0; i < atributos.length; i++) {
            const atributo = atributos[i];

            if (consejo.hasOwnProperty(atributo)) {
                const atributoElemento = document.createElement('p');
                atributoElemento.className = 'atributo';
                atributoElemento.textContent = `${consejo[atributo]}`;
                contenido.appendChild(atributoElemento);
            } else {
                console.log(`La propiedad ${atributo} no está definida en el objeto.`);
            }
        }

        const guardarBtn = document.createElement('button');
        guardarBtn.textContent = 'Guardar consejo';
        guardarBtn.className = 'botonGuardar';
        guardarBtn.addEventListener('click', function () {
            guardarConsejoEnBaseDeDatos(consejo);
        });
        contenido.appendChild(guardarBtn);

        tarjeta.appendChild(contenido);
        contenedorTarjetas.appendChild(tarjeta);
    });
}


/**
 * Funció per a guardar un consell en la base de dades
 * @param {*} consejo 
 */
function guardarConsejoEnBaseDeDatos(consejo) {
    fetch('../php/guardar_Consejo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            consejo: consejo.advice
        }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        alert('Error al guardar el consejo:', error);
    });
    
}

/**
 * Funció per a cercar consells
 */
const buscarConsejos = () => {
    const terminoBusqueda = document.getElementById('barraBusqueda').value;

    if (terminoBusqueda.trim() === '') {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    fetch(`https://api.adviceslip.com/advice/search/${encodeURIComponent(terminoBusqueda)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data && data.slips && data.slips.length > 0) {
                respostaApi = data.slips;
                mostrarTarjetasConsejos();
            } else {
                alert('No se encontraron consejos para el término de búsqueda proporcionado.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los consejos: ', error);
        });
}

/**
 * Funció per a realitzar una cerca
 */
function realizarBusqueda() {
    const terminoBusqueda = document.getElementById('terminoBusqueda').value;

    // Realizar la solicitud a la API con el término de búsqueda (incluso si es vacío)
    fetch(`../php/recuperarConsells.php?termino=${encodeURIComponent(terminoBusqueda)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            mostrarResultadoBusqueda(data);
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda: ', error);
        });
}

/**
 * Funció per a mostrar el resultat de la cerca
 * @param {*} consells 
 */
function mostrarResultadoBusqueda(consells) {
    const resultadoBusquedaContainer = document.getElementById('resultadoBusquedaContainer');
    resultadoBusquedaContainer.innerHTML = '';

    if (consells.length === 0) {
        alert('No se encontraron consejos para el término de búsqueda proporcionado.');
    } else {
        consells.forEach(consejo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta';

            const contenido = document.createElement('div');
            contenido.className = 'contenido';

            const atributoElemento = document.createElement('p');
            atributoElemento.className = 'atributo';
            atributoElemento.textContent = `${consejo.consejo}`;
            contenido.appendChild(atributoElemento);

            tarjeta.appendChild(contenido);
            resultadoBusquedaContainer.appendChild(tarjeta);
        });
    }
}


