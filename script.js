// Função para atualizar o iframe com o canal correto
function updateChannel() {
  const channelInput = document.getElementById('channel-id').value.trim();
  const iframe = document.getElementById('live-count');

  // Validação da entrada
  if (channelInput === '') {
    alert('Por favor, insira uma ID ou nome de usuário válido.');
    return;
  }

  // Construção da URL do Social Blade
  if (channelInput.startsWith('@')) {
    // Se for um nome de usuário
    iframe.src = `https://socialblade.com/youtube/user/${channelInput.substring(1)}/realtime`;
  } else {
    // Se for uma ID de canal
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
