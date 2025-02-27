// Global array for storing face data
// Each entry: { name, age, imageData (Base64), descriptor (Array) }
let faceDatabase = JSON.parse(localStorage.getItem('faceDatabase')) || [];

// Save database to localStorage
function updateDatabase() {
  localStorage.setItem('faceDatabase', JSON.stringify(faceDatabase));
}

// Compress an image file using a canvas (moderate compression)
function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
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
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load face-api models before starting
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

loadModels().then(() => {
  console.log("Face-api models loaded.");
  initApp();
}).catch(err => {
  console.error("Error loading models:", err);
});

function initApp() {
  // DOM elements for uploading face
  const uploadFileInput = document.getElementById('upload-file');
  const personNameInput = document.getElementById('person-name');
  const personAgeInput = document.getElementById('person-age');
  const uploadButton = document.getElementById('upload-button');
  const uploadStatusDiv = document.getElementById('upload-status');
  
  // Upload face event
  uploadButton.addEventListener('click', async () => {
    const file = uploadFileInput.files[0];
    const name = personNameInput.value.trim();
    const age = personAgeInput.value.trim();
    if (!file || !name || !age) {
      alert('Preencha todos os campos e selecione uma foto.');
      return;
    }
    try {
      uploadStatusDiv.textContent = 'Processando imagem...';
      const compressedData = await compressImage(file);
      const img = new Image();
      img.src = compressedData;
      await new Promise(res => img.onload = res);
      
      // Get face descriptor
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detection) {
        uploadStatusDiv.textContent = 'Nenhuma face detectada.';
        return;
      }
      
      const descriptor = Array.from(detection.descriptor);
      faceDatabase.push({ name, age, imageData: compressedData, descriptor });
      updateDatabase();
      uploadStatusDiv.textContent = 'Face salva com sucesso!';
      console.log(`Salvou: ${name}, ${age}`);
      // Clear inputs
      uploadFileInput.value = "";
      personNameInput.value = "";
      personAgeInput.value = "";
    } catch (err) {
      console.error(err);
      uploadStatusDiv.textContent = 'Erro no processamento da imagem.';
    }
  });
  
  // DOM elements for matching face
  const matchFileInput = document.getElementById('match-file');
  const matchButton = document.getElementById('match-button');
  const matchProgressBar = document.getElementById('match-progress-bar');
  const matchProgressText = document.getElementById('match-progress-text');
  const matchResultDiv = document.getElementById('match-result');
  
  // Match face event
  matchButton.addEventListener('click', async () => {
    const file = matchFileInput.files[0];
    if (!file) {
      alert('Selecione uma foto para buscar o match.');
      return;
    }
    try {
      matchResultDiv.textContent = 'Processando imagem de busca...';
      const queryImageData = await compressImage(file);
      const img = new Image();
      img.src = queryImageData;
      await new Promise(res => img.onload = res);
      
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detection) {
        matchResultDiv.textContent = 'Nenhuma face detectada na imagem de busca.';
        return;
      }
      
      simulateMatching(detection.descriptor);
    } catch (err) {
      console.error(err);
      matchResultDiv.textContent = 'Erro no processamento da imagem de busca.';
    }
  });
  
  // Simulate matching process: compare query descriptor with stored faces
  function simulateMatching(queryDescriptor) {
    if (faceDatabase.length === 0) {
      matchResultDiv.textContent = 'Banco de dados vazio.';
      return;
    }
    let index = 0;
    let results = [];
    const totalFaces = faceDatabase.length;
    matchProgressBar.style.width = '0%';
    matchProgressText.textContent = '0%';
    matchResultDiv.textContent = 'Procurando match...';
    
    // Threshold for similarity (adjust as needed)
    const threshold = 0.6;
    
    const interval = setInterval(() => {
      if (index < totalFaces) {
        const storedFace = faceDatabase[index];
        if (storedFace.descriptor) {
          const storedDescriptor = new Float32Array(storedFace.descriptor);
          const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);
          let similarity = Math.max(0, Math.min(100, Math.round((1 - distance / threshold) * 100)));
          results.push({ face: storedFace, similarity });
          console.log(`Face ${index + 1}: Distância = ${distance.toFixed(3)} => Similaridade = ${similarity}%`);
        }
        index++;
        const progress = Math.floor((index / totalFaces) * 100);
        matchProgressBar.style.width = progress + '%';
        matchProgressText.textContent = progress + '%';
      } else {
        clearInterval(interval);
        // Sort results by similarity descending
        results.sort((a, b) => b.similarity - a.similarity);
        if (results.length > 0) {
          let resultHTML = '';
          results.forEach((r, i) => {
            resultHTML += `<p><strong>${r.face.name}</strong> (${r.face.age} anos): ${r.similarity}% de similaridade</p>`;
          });
          matchResultDiv.innerHTML = resultHTML;
        } else {
          matchResultDiv.textContent = 'Nenhum match encontrado.';
        }
      }
    }, 50);
  }
}
