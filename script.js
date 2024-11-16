const fonts = [
    'Roboto', 'Poppins', 'Lobster', 'Courgette', 'Righteous', 'Monoton',
    'Raleway', 'Gloria Hallelujah', 'Fredericka the Great', 'Pacifico',
    'Quicksand', 'Sacramento', 'Shadows Into Light', 'Indie Flower',
    'Special Elite', 'Just Me Again Down Here'
];

let allSameFont = false; // Flag para verificar se todas as letras têm a mesma fonte
let clickCount = 0; // Contador de cliques compartilhado

function checkSameFont(elements) {
    const firstFont = elements[0].style.fontFamily;
    allSameFont = Array.from(elements).every(span => span.style.fontFamily === firstFont);
}

function applyHoverEffect(element) {
    const text = element.textContent;
    element.innerHTML = '';

    // Cria um span para cada letra
    text.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.transition = 'font-family 0.3s ease';
        
        // Adiciona evento de hover
        span.addEventListener('mouseover', () => {
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            span.style.fontFamily = randomFont;
            checkSameFont(element.children); // Verifica se todas as fontes são iguais
            if (allSameFont) {
                showPopup(); // Mostra o popup se todas as fontes forem iguais
            }
        });

        element.appendChild(span);
    });
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000); // Esconde após 3 segundos
}

// Função para mostrar o popup estilo "feverdream"
function showFeverDreamPopup() {
    const popup = document.getElementById('popup');
    popup.innerHTML = "<h2>You made it! Welcome to the Fever Dream!</h2>"; // Conteúdo personalizado
    popup.classList.remove('hidden');
    popup.classList.add('feverdream'); // Classe para estilo feverdream

    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('feverdream');
    }, 10000); // Esconde o popup após 10 segundos
}

// Função para incrementar o contador de cliques e verificar se atingiu 5 cliques
function incrementClickCount() {
    clickCount++;
    if (clickCount === 15) {
        showFeverDreamPopup(); // Mostra o popup se o contador chegar a 5
        clickCount = 0; // Reseta o contador
    }
}

// Adiciona evento de clique no logo
const logo = document.querySelector('.logo');
logo.addEventListener('click', incrementClickCount);

// Seleciona o botão de alternância e o elemento body
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Verifica o tema salvo no localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === 'light-theme') {
        themeToggle.textContent = '🌞'; // Ícone do sol para o tema claro
    }
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    if (body.classList.contains('light-theme')) {
        themeToggle.textContent = '🌞'; // Tema claro
        localStorage.setItem('theme', 'light-theme');
    } else {
        themeToggle.textContent = '🌙'; // Tema escuro
        localStorage.setItem('theme', 'dark-theme');
    }

    incrementClickCount(); // Incrementa o contador de cliques ao alternar o tema
});


// Aplicar efeito hover a todos os elementos com a classe 'hover-font'
const hoverFonts = document.querySelectorAll('.hover-font');
hoverFonts.forEach(element => {
    applyHoverEffect(element);
});

// Efeito parallax para o Hero
const heroSection = document.getElementById('hero');
const layers = document.querySelectorAll('.parallax-layer');

heroSection.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 40; 
    const y = (window.innerHeight / 2 - e.pageY) / 40;

    layers.forEach((layer, index) => {
        const speed = (index + 1) * 1.5; // Ajusta a velocidade de cada camada
        layer.style.transform = `translate(${x / speed}px, ${y / speed}px)`;
    });
});
function showFeverDreamPopup() {
    // Redireciona para a nova página feverdream.html
    window.location.href = 'feverdream.html';
}
