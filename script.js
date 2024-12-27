// Função que atualiza o iframe para carregar o canal correto
function updateChannel() {
  const channelInput = document.getElementById('channel-id').value.trim();
  const iframe = document.getElementById('live-count');

  // Validação de entrada
  if (channelInput === '') {
    alert('Por favor, insira uma ID de canal ou nome de usuário válido.');
    return;
  }

  // Construção do URL do Social Blade
  if (channelInput.startsWith('@')) {
    // Caso seja um nome de usuário
    iframe.src = `https://socialblade.com/youtube/user/${channelInput.replace('@', '')}/realtime`;
  } else {
    // Caso seja uma ID do canal
    iframe.src = `https://socialblade.com/youtube/channel/${channelInput}/realtime`;
  }
}

// Configuração inicial ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('live-count');
  const DEFAULT_CHANNEL_URL = 'https://socialblade.com/youtube/channel/UCfiqIvvkywBMifXT_vCng_g/realtime';

  // Definir o canal padrão (Gustavo Mendes)
  iframe.src = DEFAULT_CHANNEL_URL;
});
