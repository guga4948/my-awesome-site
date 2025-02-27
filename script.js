document.addEventListener('DOMContentLoaded', () => {
  const trainButton = document.getElementById('train-button');
  const testButton = document.getElementById('test-button');
  const trainingInput = document.getElementById('training-input');
  const testInput = document.getElementById('test-input');
  const gridOutput = document.getElementById('grid-output');

  // Load previously stored training data or initialize an empty array.
  let modelData = JSON.parse(localStorage.getItem('modelData')) || [];

  // "Train" the model by storing the exercise data.
  trainButton.addEventListener('click', () => {
    const data = trainingInput.value.trim();
    if (data !== '') {
      modelData.push(data);
      localStorage.setItem('modelData', JSON.stringify(modelData));
      alert('Training data added!');
      trainingInput.value = '';
    }
  });

  // "Test" the model by generating a grid drawing output.
  testButton.addEventListener('click', () => {
    const query = testInput.value.trim();
    if (query === '') {
      alert('Please enter an exercise query.');
      return;
    }
    runModel(query);
  });

  // Dummy AI model function that generates a 10x10 grid.
  function runModel(query) {
    // Clear any previous grid.
    gridOutput.innerHTML = '';

    const rows = 10;
    const cols = 10;
    // Create a simple pseudo-random generator seeded by the query string.
    const seed = hashCode(query);
    let random = mulberry32(seed);

    // Generate the grid cells.
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');

      // For demonstration, if there's training data and the random value is high, fill the cell.
      if (modelData.length > 0 && random() > 0.5) {
        cell.style.backgroundColor = '#007acc';
        cell.textContent = 'X';
        cell.style.color = '#fff';
      } else {
        cell.style.backgroundColor = '#fff';
        cell.textContent = '';
      }
      gridOutput.appendChild(cell);
    }
  }

  // A simple hash function to convert a string into an integer.
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32-bit integer.
    }
    return hash;
  }

  // Pseudo-random generator (Mulberry32) seeded with an integer.
  function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  }
});
