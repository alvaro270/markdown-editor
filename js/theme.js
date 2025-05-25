// 🎯 HU2: MODO OSCURO/CLARO

// 1. ESTADO Y CONFIGURACIÓN

// Variable de estado para el tema actual (persistencia en memoria)
let currentTheme = 'light'; // 'light' o 'dark'

// Configuración de temas
const themeConfig = {
  light: {
    name: 'Modo Claro',
    icon: '🌙',
    classes: {
      body: 'bg-gray-100 text-gray-900',
      header: 'bg-blue-600',
      toolbar: 'bg-white shadow-md',
      card: 'bg-white',
      editor: 'bg-white text-gray-900',
      preview: 'bg-gray-50 text-gray-900',
      cardHeader: 'bg-gray-800 text-white'
    }
  },
  dark: {
    name: 'Modo Oscuro',
    icon: '☀️',
    classes: {
      body: 'bg-gray-900 text-white',
      header: 'bg-gray-800',
      toolbar: 'bg-gray-800 shadow-lg',
      card: 'bg-gray-800',
      editor: 'bg-gray-700 text-white',
      preview: 'bg-gray-900 text-gray-100',
      cardHeader: 'bg-gray-900 text-gray-100'
    }
  }
};

// ========================================
// 2. FUNCIÓN PRINCIPAL DE TOGGLE
// ========================================

/**
 * Alterna entre modo oscuro y claro
 */
function toggleTheme() {
  try {
    // Cambiar el estado del tema
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Aplicar el nuevo tema
    applyTheme(currentTheme);
    
    // Actualizar botón con feedback
    updateThemeButton();
    
    // Mostrar notificación de cambio
    showThemeNotification(currentTheme);
    
    console.log(`🎨 Tema cambiado a: ${themeConfig[currentTheme].name}`);
    
  } catch (error) {
    console.error('❌ Error al cambiar tema:', error);
    showThemeError();
  }
}

// ========================================
// 3. APLICACIÓN DEL TEMA
// ========================================

/**
 * Aplica un tema específico a toda la interfaz
 * @param {string} themeName - 'light' o 'dark'
 */
function applyTheme(themeName) {
  const theme = themeConfig[themeName];
  if (!theme) {
    throw new Error(`Tema "${themeName}" no encontrado`);
  }
  
  // Aplicar clases al body
  applyThemeToElement(document.body, theme.classes.body, 'body');
  
  // Aplicar clases al header
  const header = document.querySelector('header');
  if (header) {
    applyThemeToElement(header, theme.classes.header, 'header');
  }
  
  // Aplicar clases a la toolbar
  const toolbar = document.querySelector('.toolbar');
  if (toolbar) {
    applyThemeToElement(toolbar, theme.classes.toolbar, 'toolbar');
  }
  
  // Aplicar clases a tarjetas principales
  const cards = document.querySelectorAll('.bg-white');
  cards.forEach(card => {
    applyThemeToElement(card, theme.classes.card, 'card');
  });
  
  // Aplicar clases específicas al editor
  const editor = document.querySelector('#markdownEditor');
  if (editor) {
    applyThemeToElement(editor, theme.classes.editor, 'editor');
  }
  
  // Aplicar clases específicas al preview
  const preview = document.querySelector('#htmlPreview');
  if (preview) {
    applyThemeToElement(preview, theme.classes.preview, 'preview');
  }
  
  // Aplicar clases a headers de tarjetas
  const cardHeaders = document.querySelectorAll('.bg-gray-800, .bg-blue-800');
  cardHeaders.forEach(header => {
    applyThemeToElement(header, theme.classes.cardHeader, 'cardHeader');
  });
  
  // Aplicar estilos adicionales específicos del tema
  applyCustomThemeStyles(themeName);
}

/**
 * Aplica clases de tema a un elemento específico
 * @param {Element} element - Elemento DOM
 * @param {string} newClasses - Nuevas clases a aplicar
 * @param {string} elementType - Tipo de elemento para logging
 */
function applyThemeToElement(element, newClasses, elementType) {
  if (!element) return;
  
  // Remover clases de tema anteriores
  removeThemeClasses(element);
  
  // Agregar nuevas clases
  const classArray = newClasses.split(' ');
  classArray.forEach(className => {
    if (className.trim()) {
      element.classList.add(className.trim());
    }
  });
}

/**
 * Remueve clases de tema conocidas de un elemento
 * @param {Element} element - Elemento DOM
 */
function removeThemeClasses(element) {
  const themeClassPatterns = [
    /^bg-(gray|blue|white)-\d+$/,
    /^text-(gray|white)-\d+$/,
    /^shadow-(md|lg)$/
  ];
  
  const classesToRemove = [];
  
  element.classList.forEach(className => {
    if (themeClassPatterns.some(pattern => pattern.test(className))) {
      classesToRemove.push(className);
    }
  });
  
  classesToRemove.forEach(className => {
    element.classList.remove(className);
  });
}

// ========================================
// 4. ESTILOS PERSONALIZADOS POR TEMA
// ========================================

/**
 * Aplica estilos CSS personalizados según el tema
 * @param {string} themeName - Nombre del tema
 */
function applyCustomThemeStyles(themeName) {
  // Buscar o crear elemento de estilos de tema
  let themeStyleElement = document.getElementById('theme-styles');
  
  if (!themeStyleElement) {
    themeStyleElement = document.createElement('style');
    themeStyleElement.id = 'theme-styles';
    document.head.appendChild(themeStyleElement);
  }
  
  // Definir estilos según el tema
  const customStyles = themeName === 'dark' ? `
    /* Estilos personalizados para modo oscuro */
    .counter-card {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%) !important;
      color: white !important;
    }
    
    .code-block {
      background: linear-gradient(135deg, #1f2937, #111827) !important;
      border-color: #374151 !important;
      color: #e5e7eb !important;
    }
    
    .error-container {
      background: #7f1d1d !important;
      border-left-color: #ef4444 !important;
      color: #fecaca !important;
    }
    
    /* Scrollbar personalizada para modo oscuro */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #374151;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #6b7280;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  ` : `
    /* Estilos personalizados para modo claro */
    .counter-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }
    
    .code-block {
      background: linear-gradient(135deg, #1e3a8a, #3730a3) !important;
      border-color: #4f46e5 !important;
      color: #e2e8f0 !important;
    }
    
    .error-container {
      background: #fef2f2 !important;
      border-left-color: #ef4444 !important;
      color: #991b1b !important;
    }
    
    /* Scrollbar por defecto para modo claro */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  
  themeStyleElement.textContent = customStyles;
}

// ========================================
// 5. FEEDBACK Y NOTIFICACIONES
// ========================================

/**
 * Actualiza el botón de tema con el estado actual
 */
function updateThemeButton() {
  const button = document.getElementById('themeToggle');
  if (!button) return;
  
  const theme = themeConfig[currentTheme];
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  const nextThemeConfig = themeConfig[nextTheme];
  
  // Efecto de clic
  button.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    button.style.transform = 'scale(1)';
    button.textContent = `${nextThemeConfig.icon} ${nextThemeConfig.name}`;
    
    // Cambiar colores del botón según el tema actual
    if (currentTheme === 'dark') {
      button.className = 'bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300';
    } else {
      button.className = 'bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300';
    }
  }, 100);
}

/**
 * Muestra notificación de cambio de tema
 * @param {string} themeName - Tema aplicado
 */
function showThemeNotification(themeName) {
  const theme = themeConfig[themeName];
  const message = `Cambiado a ${theme.name}`;
  
  const notification = document.createElement('div');
  const bgColor = themeName === 'dark' ? 'bg-gray-700' : 'bg-blue-500';
  
  notification.className = `fixed top-4 left-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 notification-enter`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xl">${theme.icon}</span>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 2000);
}

/**
 * Muestra error en cambio de tema
 */
function showThemeError() {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xl">⚠️</span>
      <span class="font-medium">Error al cambiar tema</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// ========================================
// 6. INICIALIZACIÓN
// ========================================

/**
 * Inicializa el sistema de temas
 */
function initializeThemeSystem() {
  console.log('🎨 Inicializando sistema de temas...');
  
  // Aplicar tema inicial
  applyTheme(currentTheme);
  
  // Configurar botón inicial
  updateThemeButton();
  
  console.log(`✅ Sistema de temas inicializado en modo: ${themeConfig[currentTheme].name}`);
}