const subscriberCountEl = document.getElementById('subscriber-count');
const ctx = document.getElementById('subscriber-graph').getContext('2d');

let subscriberCount = 1000; // Starting subscribers
let subscriberHistory = [subscriberCount];
let timestampHistory = [new Date().toLocaleTimeString()];

// Function to simulate subscriber changes
function simulateSubscriberCount() {
  // Simulate fluctuation: -5 to +5 random
  const fluctuation = Math.floor(Math.random() * 11) - 5;
  subscriberCount = Math.max(0, subscriberCount + fluctuation); // Prevent negative subscribers

  const timestamp = new Date().toLocaleTimeString();
  subscriberHistory.push(subscriberCount);
  timestampHistory.push(timestamp);

  // Limit history to 10 points
  if (subscriberHistory.length > 10) {
    subscriberHistory.shift();
    timestampHistory.shift();
  }

  // Update the graph
  updateGraph();

  // Update the UI
  subscriberCountEl.textContent = subscriberCount;
}

// Initialize Chart.js graph
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: timestampHistory,
    datasets: [
      {
        label: 'Subscribers',
        data: subscriberHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Time' },
      },
      y: {
        title: { display: true, text: 'Subscribers' },
        beginAtZero: true,
      },
    },
  },
});

// Function to update the graph data
function updateGraph() {
  chart.data.labels = timestampHistory;
  chart.data.datasets[0].data = subscriberHistory;
  chart.update();
}

// Simulate live updates every 2 seconds
setInterval(simulateSubscriberCount, 2000);
