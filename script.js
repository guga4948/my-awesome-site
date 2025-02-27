document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const trainButton = document.getElementById('train-button');
  const lowResButton = document.getElementById('low-res-button');
  const medResButton = document.getElementById('med-res-button');
  const trainingInput = document.getElementById('training-input');
  const testInput = document.getElementById('test-input');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const outputDiv = document.getElementById('output');
  const feedbackCorrect = document.getElementById('feedback-correct');
  const feedbackIncorrect = document.getElementById('feedback-incorrect');

  // Retrieve training data and feedback from localStorage or initialize them
  let trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];
  let feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];

  // "Train" the AI: store the training problem in localStorage
  trainButton.addEventListener('click', () => {
    const data = trainingInput.value.trim();
    if (data !== '') {
      trainingData.push({ problem: data, correct: 0, incorrect: 0 });
      localStorage.setItem('trainingData', JSON.stringify(trainingData));
      alert('Exercício de treinamento adicionado!');
      trainingInput.value = '';
    }
  });

  // Run the model with low-resolution output
  lowResButton.addEventListener('click', () => {
    runModel('low');
  });

  // Run the model with medium-resolution output
  medResButton.addEventListener('click', () => {
    runModel('medium');
  });

  // Feedback: Correct or Incorrect for the last generated solution
  feedbackCorrect.addEventListener('click', () => {
    recordFeedback(true);
  });
  feedbackIncorrect.addEventListener('click', () => {
    recordFeedback(false);
  });

  // Global variable to store last test query and resolution for feedback logging
  let lastTest = null;

  // Simulate running the model: show progress and then display a solution
  function runModel(resolution) {
    const query = testInput.value.trim();
    if (!query) {
      alert('Por favor, digite um problema para testar.');
      return;
    }
    lastTest = { query, resolution, timestamp: Date.now() };
    // Reset progress and output
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    outputDiv.textContent = '';

    // Choose parameters based on resolution mode:
    let increment, intervalTime;
    if (resolution === 'low') {
      // Faster progress: complete in ~1 second
      increment = 10; // 10% per tick
      intervalTime = 100; // every 100ms → ~1 second total
    } else {
      // Medium resolution: complete in ~5 seconds
      increment = 2; // 2% per tick
      intervalTime = 100;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += increment;
      if (progress > 100) progress = 100;
      progressBar.style.width = progress + '%';
      progressText.textContent = progress + '%';
      if (progress === 100) {
        clearInterval(interval);
        const solution = solveProblem(query, resolution);
        outputDiv.textContent = solution;
      }
    }, intervalTime);
  }

  // Dummy solver function: returns a response based on resolution and training data
  function solveProblem(problemText, resolution) {
    if (resolution === 'low') {
      return "Resposta (baixa resolução):\nSolução preliminar para \"" + problemText + "\".";
    } else if (resolution === 'medium') {
      let response = "Resposta (média resolução):\n";
      if (trainingData.length > 0) {
        response += "Baseado em " + trainingData.length + " exercícios treinados, ";
        response += "a solução sugerida para \"" + problemText + "\" é: [Solução simulada detalhada].";
      } else {
        response += "Sem dados de treinamento suficientes para gerar uma resposta detalhada.";
      }
      return response;
    }
    return "Solução não definida.";
  }

  // Record feedback for the last test
  function recordFeedback(isCorrect) {
    if (!lastTest) {
      alert("Nenhuma resposta gerada para fornecer feedback.");
      return;
    }
    feedbackData.push({
      query: lastTest.query,
      resolution: lastTest.resolution,
      correct: isCorrect,
      timestamp: Date.now()
    });
    localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
    alert("Feedback registrado: " + (isCorrect ? "Correto" : "Incorreto"));
    lastTest = null;
  }
});
