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

        const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        detections.forEach(async (detection) => {
            const { age, gender } = detection;
            const expressions = detection.expressions;
            const [emotion, maxScore] = Object.entries(expressions).reduce(
                (acc, [emotion, score]) =>
                    score > acc[1] ? [emotion, score] : acc,
                ["", -1]
            );

            // Crear un objeto con los datos a enviar al backend
            const data = {
                gender: gender,
                age: parseInt(parseFloat(age)),
                emotion: emotion,
            };

            console.log(data);
            console.log("******************");

            if (data && band === true) {
                document.getElementById("check-person").hidden = false;
                document.getElementById("loader-spin").hidden = true;
                document.getElementById("detected-message").innerText =
                    "Rostro Detectado";
                band = false;
            }

            setTimeout(function () {
                if (data && band_2 === true) {
                    setInformation(data);
                    band_2 = false;
                }
            }, 2000);

            // Enviar los datos al backend
            /* fetch("http://localhost:8000/", {
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
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                }); */
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
        genderSelect.value = "masculino";
    } else if (data.gender === "female") {
        genderSelect.value = "femenino";
    }
    emotionInput.value = data.emotion;
}
