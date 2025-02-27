// Global array for storing face data
// Each face: { name, age, imageData (compressed Base64 string) }
let faceDatabase = JSON.parse(localStorage.getItem('faceDatabase')) || [];

// Save the updated database to localStorage
function updateDatabase() {
  localStorage.setItem('faceDatabase', JSON.stringify(faceDatabase));
}

// Compress an image file using a canvas and return a Promise with the compressed Base64 string
function compressImage(file, maxWidth = 200, maxHeight = 200, quality = 0.7) {
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

// DOM elements for uploading
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
    uploadStatusDiv.textContent = 'Processando e comprimindo imagem...';
    const compressedData = await compressImage(file);
    faceDatabase.push({ name, age, imageData: compressedData });
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
matchButton.addEventListener('click', () => {
  const file = matchFileInput.files[0];
  if (!file) {
    // For debugging, if no file is selected, use a dummy image string
    console.warn("Nenhuma foto de busca selecionada, usando dummy data para teste.");
    simulateMatching("dummy_query_data");
    return;
  }
  compressImage(file).then(queryImageData => {
    simulateMatching(queryImageData);
  }).catch(err => {
    console.error(err);
    matchResultDiv.textContent = 'Erro ao processar a imagem de busca.';
  });
});

// Simulate matching process: iterate through the database and update progress
function simulateMatching(queryImageData) {
  console.log("Simulate matching started.");
  // For testing, if the database is empty, add a dummy face
  if (faceDatabase.length === 0) {
    console.warn("Banco de dados vazio. Adicionando face dummy para teste.");
    faceDatabase.push({ name: "Dummy", age: "30", imageData: "data:image/jpeg;base64,dummydata" });
    updateDatabase();
  }
  let index = 0;
  let bestMatch = null;
  let bestSimilarity = 0;
  const totalFaces = faceDatabase.length;
  matchProgressBar.style.width = '0%';
  matchProgressText.textContent = '0%';
  matchResultDiv.textContent = 'Procurando match...';
  
  const interval = setInterval(() => {
    if (index < totalFaces) {
      // Simulate similarity calculation (for demo, a random value)
      const similarity = Math.floor(Math.random() * 100);
      console.log(`Processando face ${index+1}/${totalFaces}: Similaridade = ${similarity}%`);
      if (similarity >= 90 && similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = faceDatabase[index];
      }
      index++;
      const progress = Math.floor((index / totalFaces) * 100);
      matchProgressBar.style.width = progress + '%';
      matchProgressText.textContent = progress + '%';
    } else {
      clearInterval(interval);
      if (bestMatch) {
        matchResultDiv.innerHTML = `<strong>Match encontrado!</strong><br>Nome: ${bestMatch.name}<br>Idade: ${bestMatch.age}<br>Similaridade: ${bestSimilarity}%`;
      } else {
        matchResultDiv.textContent = 'Nenhum match com 90%+ encontrado.';
      }
      console.log("Matching complete.");
    }
  }, 50); // Process one face every 50ms
}
