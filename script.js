// Default Channel (Gustavo Mendes)
const DEFAULT_CHANNEL_URL = 'https://socialblade.com/youtube/channel/UCfiqIvvkywBMifXT_vCng_g/realtime';

// Update the iframe source dynamically
function updateChannel() {
  const channelInput = document.getElementById('channel-id').value;
  const iframe = document.getElementById('live-count');

  // Validate input and update the iframe URL
  if (channelInput.trim() !== '') {
    iframe.src = `https://socialblade.com/youtube/channel/${channelInput}/realtime`;
  } else {
    alert('Please enter a valid YouTube Channel ID.');
  }
}

// Set the default channel when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('live-count');
  iframe.src = DEFAULT_CHANNEL_URL;
});
