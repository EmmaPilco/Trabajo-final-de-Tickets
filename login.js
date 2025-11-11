// Credenciales de técnicos - VERSIÓN MEJORADA
const VALID_USERS = {
    'admin': { password: 'matebit2025', nombreReal: 'Emmanuel Pilco' },
    'rpilco': { password: 'matebit2025', nombreReal: 'Emmanuel Pilco' },
    'rtapia': { password: 'tecnico2025', nombreReal: 'Rodrigo Tapia' },
    'nfernandez': { password: 'tecnico2025', nombreReal: 'Naobi Fernandez' },
    'rgonzales': { password: 'tecnico2025', nombreReal: 'Rafael Gonzales' }
};

// Verificar si el usuario ya está logueado
function checkAuth() {
    return localStorage.getItem('techLoggedIn') === 'true';
}

// Función de login - ACTUALIZADA
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    // Verificar credenciales
    const userData = VALID_USERS[username];
    if (userData && userData.password === password) {
        // Login exitoso
        localStorage.setItem('techLoggedIn', 'true');
        localStorage.setItem('techUsername', username);
        localStorage.setItem('techNombreReal', userData.nombreReal);
        
        alert(`✅ Login exitoso. Bienvenido ${userData.nombreReal}`);
        window.location.href = 'tech-dashboard.html';
    } else {
        alert('❌ Usuario o contraseña incorrectos.');
    }
}

// Función de logout - MEJORADA
function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('techLoggedIn');
        localStorage.removeItem('techUsername');
        localStorage.removeItem('techNombreReal');
        alert('👋 Sesión cerrada correctamente');
        window.location.href = 'login.html';
    }
}

// Proteger páginas de técnicos
function requireAuth() {
    if (!checkAuth()) {
        alert('🔒 Debes iniciar sesión para acceder a esta página');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Mostrar información del usuario en páginas técnicas
function mostrarInfoUsuario() {
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) {
        const nombreReal = localStorage.getItem('techNombreReal') || 'Técnico';
        userNameElement.textContent = nombreReal;
    }
    
    if (userAvatarElement) {
        const nombreReal = localStorage.getItem('techNombreReal') || 'T';
        userAvatarElement.textContent = nombreReal.charAt(0).toUpperCase();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Si estamos en una página de técnicos, verificar autenticación y mostrar info
    if (window.location.pathname.includes('tech-') || 
        window.location.pathname.includes('tech-dashboard.html') ||
        window.location.pathname.includes('tech-turnos.html')) {
        if (requireAuth()) {
            mostrarInfoUsuario();
        }
    }
});