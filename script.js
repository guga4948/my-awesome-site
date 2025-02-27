// Global array for storing face data
// Each entry: { name, age, imageData (Base64), descriptor (Float32Array as JSON) }
let faceDatabase = JSON.parse(localStorage.getItem('faceDatabase')) || [];

// Save database to localStorage
function updateDatabase() {
  localStorage.setItem('faceDatabase', JSON.stringify(faceDatabase));
}

// Less aggressive image compression (moderate dimensions and quality)
function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataURL = canvas.toDataURL('image/jpeg', quality);
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load face-api models before starting the app
async function loadModels() {
  // Note: Ensure you have a "models" folder with the required models.
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

// Once models are loaded, start the app
loadModels().then(() => {
  console.log("Models loaded.");
  initApp();
}).catch(err => {
  console.error("Error loading models:", err);
});

// Main app initialization
function initApp() {
  // DOM elements for uploading face
  const uploadFileInput = document.getElementById('upload-file');
  const personNameInput = document.getElementById('person-name');
  const personAgeInput = document.getElementById('person-age');
  const uploadButton = document.getElementById('upload-button');
  const uploadStatusDiv = document.getElementById('upload-status');
  
  // Upload & store face
  uploadButton.addEventListener('click', async () => {
    const file = uploadFileInput.files[0];
    const name = personNameInput.value.trim();
    const age = personAgeInput.value.trim();
    if (!file || !name || !age) {
      alert('Por favor, preencha todos os campos e selecione uma foto.');
      return;
    }
    try {
      uploadStatusDiv.textContent = 'Processando imagem...';
      const compressedData = await compressImage(file);
      // Create an image element for face-api processing
      const img = new Image();
      img.src = compressedData;
      await new Promise(res => { img.onload = res; });
      // Detect face and get descriptor
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        uploadStatusDiv.textContent = 'Nenhuma face detectada na imagem.';
        return;
      }
      const descriptor = Array.from(detection.descriptor); // convert Float32Array to plain array
      // Save to database
      faceDatabase.push({ name, age, imageData: compressedData, descriptor });
      updateDatabase();
      uploadStatusDiv.textContent = 'Face salva com sucesso!';
      console.log(`Saved face: ${name}, ${age}`);
      // Clear inputs
      uploadFileInput.value = "";
      personNameInput.value = "";
      personAgeInput.value = "";
    } catch (err) {
      console.error(err);
      uploadStatusDiv.textContent = 'Erro ao processar a imagem.';
    }
  });

  // DOM elements for matching
  const matchFileInput = document.getElementById('match-file');
  const matchButton = document.getElementById('match-button');
  const matchProgressBar = document.getElementById('match-progress-bar');
  const matchProgressText = document.getElementById('match-progress-text');
  const matchResultDiv = document.getElementById('match-result');

  // When matching, process the query image
  matchButton.addEventListener('click', async () => {
    const file = matchFileInput.files[0];
    if (!file) {
      alert('Por favor, selecione uma foto para buscar o match.');
      return;
    }
    try {
      matchResultDiv.textContent = 'Processando imagem de busca...';
      const queryImageData = await compressImage(file);
      // Create an image element for face-api processing
      const img = new Image();
      img.src = queryImageData;
      await new Promise(res => { img.onload = res; });
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        matchResultDiv.textContent = 'Nenhuma face detectada na imagem de busca.';
        return;
      }
      const queryDescriptor = detection.descriptor;
      // Start matching process using actual descriptor comparisons
      simulateMatching(queryDescriptor);
    } catch (err) {
      console.error(err);
      matchResultDiv.textContent = 'Erro ao processar a imagem de busca.';
    }
  });

  // Simulate matching process: iterate through database and compute similarity
  function simulateMatching(queryDescriptor) {
    if (faceDatabase.length === 0) {
      matchResultDiv.textContent = 'Banco de dados vazio.';
      return;
    }
    let index = 0;
    let bestMatch = null;
    let bestSimilarity = 0;
    const totalFaces = faceDatabase.length;
    matchProgressBar.style.width = '0%';
    matchProgressText.textContent = '0%';
    matchResultDiv.textContent = 'Procurando match...';
    
    // Define a threshold distance for a perfect match (you can adjust this)
    const threshold = 0.6;
    
    const interval = setInterval(() => {
      if (index < totalFaces) {
        const storedFace = faceDatabase[index];
        if (storedFace.descriptor) {
          // Compute Euclidean distance between descriptors
          const storedDescriptor = new Float32Array(storedFace.descriptor);
          const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);
          // Map distance to a match percentage.
          // If distance==0 then match = 100%, if distance==threshold then 0%
          let similarity = Math.max(0, Math.min(100, Math.round((1 - distance/threshold) * 100)));
          console.log(`Processando face ${index+1}/${totalFaces}: Distância = ${distance.toFixed(3)}, Similaridade = ${similarity}%`);
          // For our demo, update best match if similarity is higher
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = storedFace;
          }
        }
        index++;
        const progress = Math.floor((index / totalFaces) * 100);
        matchProgressBar.style.width = progress + '%';
        matchProgressText.textContent = progress + '%';
      } else {
        clearInterval(interval);
        if (bestMatch) {
          // Show result along with match percentage
          matchResultDiv.innerHTML = `<strong>Match encontrado!</strong><br>Nome: ${bestMatch.name}<br>Idade: ${bestMatch.age}<br>Similaridade: ${bestSimilarity}%`;
        } else {
          matchResultDiv.textContent = 'Nenhum match encontrado.';
        }
        console.log("Matching complete.");
      }
    }, 50); // Process one face every 50ms
  }
}
