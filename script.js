document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const trainButton = document.getElementById('train-button');
  const lowResButton = document.getElementById('low-res-button');
  const medResButton = document.getElementById('med-res-button');
  const trainingInput = document.getElementById('training-input');
  const testInput = document.getElementById('test-input');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const canvas = document.getElementById('canvas-output');
  const ctx = canvas.getContext('2d');
  const feedbackCorrect = document.getElementById('feedback-correct');
  const feedbackIncorrect = document.getElementById('feedback-incorrect');

  // Retrieve training and feedback data from localStorage
  let trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];
  let feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];

  // Training: store the problem in localStorage
  trainButton.addEventListener('click', () => {
    const data = trainingInput.value.trim();
    if (data !== '') {
      trainingData.push({ problem: data, correct: 0, incorrect: 0 });
      localStorage.setItem('trainingData', JSON.stringify(trainingData));
      alert('Exercício de treinamento adicionado!');
      trainingInput.value = '';
    }
  });

  // Run model buttons
  lowResButton.addEventListener('click', () => runModel('low'));
  medResButton.addEventListener('click', () => runModel('medium'));

  // Feedback buttons
  feedbackCorrect.addEventListener('click', () => recordFeedback(true));
  feedbackIncorrect.addEventListener('click', () => recordFeedback(false));

  let lastTest = null;

  // Main function to run the model with simulated progress
  function runModel(resolution) {
    const query = testInput.value.trim();
    if (!query) {
      alert('Por favor, digite um problema para testar.');
      return;
    }
    console.log("runModel called with resolution:", resolution, "query:", query);
    lastTest = { query, resolution, timestamp: Date.now() };

    // Reset progress and canvas
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set total simulation time (in ms)
    const totalTime = resolution === 'low' ? 500 : 5000;
    const startTime = Date.now();

    // Update progress every 50ms
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let progress = Math.floor((elapsed / totalTime) * 100);
      if (progress > 100) progress = 100;
      progressBar.style.width = progress + '%';
      progressText.textContent = progress + '%';

      if (progress >= 100) {
        clearInterval(timer);
        console.log("Progress complete, drawing solution");
        const solution = parseProblem(query);
        drawSolution(solution, resolution);
      }
    }, 50);
  }

  // Parse the problem text for keywords to decide the drawing type
  function parseProblem(problemText) {
    const lowerText = problemText.toLowerCase();
    console.log("Parsing problem text:", lowerText);
    if (lowerText.includes("segmento") || lowerText.includes("reta")) {
      console.log("Detected a line problem");
      // Dummy parameters for a line drawing
      return { type: "line", params: { x0: 50, y0: 200, x1: 350, y1: 200 } };
    } else if (lowerText.includes("círculo") || lowerText.includes("circulo")) {
      console.log("Detected a circle problem");
      return { type: "circle", params: { x: 200, y: 200, radius: 100 } };
    } else if (lowerText.includes("triângulo") || lowerText.includes("triangulo")) {
      console.log("Detected a triangle problem");
      return { type: "triangle", params: { x0: 200, y0: 50, x1: 50, y1: 350, x2: 350, y2: 350 } };
    } else if (lowerText.includes("retângulo") || lowerText.includes("retangulo")) {
      console.log("Detected a rectangle problem");
      return { type: "rectangle", params: { x: 100, y: 100, width: 200, height: 150 } };
    } else {
      console.log("No recognized keywords, using default output");
      return { type: "default", params: {} };
    }
  }

  // Draw the solution on canvas based on its type and resolution mode
  function drawSolution(solution, resolution) {
    console.log("Drawing solution:", solution, "with resolution:", resolution);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#007acc";
    ctx.fillStyle = "#007acc";
    ctx.lineWidth = resolution === 'low' ? 2 : 4;
    ctx.font = resolution === 'low' ? "12px Arial" : "16px Arial";
    ctx.textAlign = "center";

    switch (solution.type) {
      case "line": {
        const { x0, y0, x1, y1 } = solution.params;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        // Draw endpoints
        ctx.beginPath();
        ctx.arc(x0, y0, resolution === 'low' ? 4 : 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x1, y1, resolution === 'low' ? 4 : 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#333";
        ctx.fillText("Linha", (x0 + x1) / 2, (y0 + y1) / 2 - 10);
        break;
      }
      case "circle": {
        const { x, y, radius } = solution.params;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "#333";
        ctx.fillText("Círculo", x, y - radius - 10);
        break;
      }
      case "triangle": {
        const { x0, y0, x1, y1, x2, y2 } = solution.params;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#333";
        ctx.fillText("Triângulo", (x0 + x1 + x2) / 3, (y0 + y1 + y2) / 3);
        break;
      }
      case "rectangle": {
        const { x, y, width, height } = solution.params;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = "#333";
        ctx.fillText("Retângulo", x + width / 2, y - 10);
        break;
      }
      default: {
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText("Problema não reconhecido.", canvas.width / 2, canvas.height / 2);
      }
    }
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
