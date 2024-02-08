const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        (stream) => (video.srcObject = stream),
        (err) => console.error(err)
    );
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.getElementById("video-container").append(canvas);

    
    
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    let band = true;
    let band_2 = true;

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        detections.forEach(async (detection) => {
            const { age, gender } = detection;
            const expressions = detection.expressions;
            const [emotion, maxScore] = Object.entries(expressions).reduce((acc, [emotion, score]) => (score > acc[1] ? [emotion, score] : acc), ["", -1]);

            // Crear un objeto con los datos a enviar al backend
            const data = {
                gender: gender,
                age: parseInt(parseFloat(age)),
                emotion: emotion,
            };
            console.log(data);

            if (data && band === true) {
                document.getElementById("check-person").hidden = false;
                document.getElementById("loader-spin").hidden = true;
                document.getElementById("detected-message").innerText = "Rostro Detectado";
                band = false;
            }

            setTimeout(function () {
                if (data && band_2 === true) {
                    setInformation(data);
                    band_2 = false;
                }
            }, 2000);
        });
    }, 100);

    //
});

function setInformation(data) {
    document.getElementById("check-person").hidden = true;
    document.getElementById("detected-message").innerText = "Tus Datos:";

    let ageInput = document.getElementById("age-id");
    let genderSelect = document.getElementById("gender-select");
    let emotionInput = document.getElementById("emotion-info");

    document.getElementById("information-person").hidden = false;
    ageInput.value = data.age;
    if (data.gender === "male") {
        genderSelect.value = "masculino";    } else if (data.gender === "female") {
        genderSelect.value = "femenino";
    }
    emotionInput.value = data.emotion;
}

function displayProducts(productos) {
    const productosUpContainer = document.getElementById("productos-superior-container");
    const productosDownContainer = document.getElementById("productos-inferior-container");
    
    productos.products.forEach((producto) => {
        // Contenedor para cada fila de producto
        const productoRowDiv = document.createElement("div");
        productoRowDiv.classList.add("producto-row");
        
        // Botón de navegación izquierda
        const navButtonLeft = document.createElement("div");
        navButtonLeft.classList.add("nav-button");
        navButtonLeft.textContent = "◀";
        
        // Botón de navegación derecha
        const navButtonRight = document.createElement("div");
        navButtonRight.classList.add("nav-button");
        navButtonRight.textContent = "▶";
        
        // Contenedor del producto
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");
        
        // Nombre del producto
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("producto-name");
        nameDiv.textContent = producto.name_product;
        
        // Imagen del producto
        const img = document.createElement("img");
        img.src = producto.image_url;
        img.alt = producto.name_product;
        
        
        
        // Agregamos los elementos al contenedor del producto
        productoDiv.appendChild(nameDiv);
        productoDiv.appendChild(img);
        
        // Agregamos los botones y el producto al contenedor de la fila
        productoRowDiv.appendChild(navButtonLeft);
        productoRowDiv.appendChild(productoDiv);
        productoRowDiv.appendChild(navButtonRight);
        
        // Determinamos en qué contenedor debe ir el producto basado en su tipo
        if (producto.type_product === "up") {
            productosUpContainer.appendChild(productoRowDiv);
        } else if (producto.type_product === "down") {
            productosDownContainer.appendChild(productoRowDiv);
        }
    });
}

// Asegúrate de llamar a esta función cuando quieras que los productos se muestren

function sendData() {
    // Obtén los datos a enviar al backend
    let data = {
        age: document.getElementById("age-id").value,
        gender: document.getElementById("gender-select").value,
        emotion: document.getElementById("emotion-info").value,
    };

    // Enviar los datos al backend
    fetch("http://localhost:8000/api/recibir-datos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error al enviar datos al servidor.");
        })
        .then((data) => {
            document.getElementById("primera-pantalla").hidden = true;
            document.getElementById("segunda-pantalla").hidden = false;
            console.log(data);
            displayProducts(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const boton = document.getElementById("button-send-data");
boton.addEventListener("click", sendData);
