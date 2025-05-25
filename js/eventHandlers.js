// 🎯 EVENT HANDLERS - MANEJO CENTRALIZADO DE EVENTOS
// Conceptos: Event Handling Básico, Event Delegation, Optimización

// ========================================
// 1. CONFIGURACIÓN DE EVENT HANDLERS PRINCIPALES
// ========================================

/**
 * Inicializa todos los event handlers de la aplicación
 * Centraliza la configuración de eventos para mejor organización
 */
function initializeEventHandlers() {
  console.log('🎮 Inicializando Event Handlers...');
  
  // HU1: Event handler para actualización automática
  setupAutoUpdateHandler();
  
  // HU2: Event handler para limpiar editor
  setupClearEditorHandler();
  
  // HU3: Event handlers para contadores (ya integrados en HU1)
  
  // Event handlers existentes
  setupExistingHandlers();
  
  // Event handlers para optimización
  setupOptimizationHandlers();
}

// ========================================
// 2. 🆕 HU1: HANDLER PARA ACTUALIZACIÓN AUTOMÁTICA
// ========================================

/**
 * Configura el event handler para actualización automática del preview
 */
function setupAutoUpdateHandler() {
  const editor = document.querySelector("#markdownEditor");
  
  if (!editor) {
    console.error('❌ No se encontró el editor');
    return;
  }
  
  // 📚 CONCEPTO: Event Handler con múltiples tipos de eventos
  
  // Evento 'input' - se dispara en cada cambio de texto
  editor.addEventListener('input', function(event) {
    console.log('📝 Texto modificado - actualizando preview automáticamente');
    autoUpdatePreview();
  });
  
  // Evento 'paste' - se dispara al pegar contenido
  editor.addEventListener('paste', function(event) {
    console.log('📋 Contenido pegado - actualizando preview');
    // Usar setTimeout para esperar que el paste se complete
    setTimeout(() => {
      autoUpdatePreview();
    }, 10);
  });
  
  // Evento 'keyup' como respaldo para casos especiales
  editor.addEventListener('keyup', function(event) {
    // Solo para teclas especiales como Delete, Backspace
    if (event.key === 'Delete' || event.key === 'Backspace') {
      console.log(`🔤 Tecla especial: ${event.key}`);
      autoUpdatePreview();
    }
  });
  
  console.log('✅ Handler de actualización automática configurado');
}

// ========================================
// 3. 🆕 HU2: HANDLER PARA LIMPIAR EDITOR
// ========================================

/**
 * Configura el event handler para el botón de limpiar editor
 */
function setupClearEditorHandler() {
  const clearBtn = document.querySelector("#clearEditor");
  
  if (!clearBtn) {
    console.error('❌ No se encontró el botón de limpiar');
    return;
  }
  
  // 📚 CONCEPTO: Event Handler con confirmación y feedback
  clearBtn.addEventListener('click', function(event) {
    console.log('🗑️ Botón limpiar presionado');
    
    // Prevenir comportamiento por defecto si fuera necesario
    event.preventDefault();
    
    // Llamar función de limpieza
    clearEditor();
  });
  
  // Event handler adicional para feedback visual al hover
  clearBtn.addEventListener('mouseenter', function() {
    clearBtn.style.transform = 'scale(1.05)';
    clearBtn.style.transition = 'transform 0.2s ease';
  });
  
  clearBtn.addEventListener('mouseleave', function() {
    clearBtn.style.transform = 'scale(1)';
  });
  
  console.log('✅ Handler de limpiar editor configurado');
}

// ========================================
// 4. HANDLERS EXISTENTES (REORGANIZADOS)
// ========================================

/**
 * Configura los event handlers existentes de la aplicación
 */
function setupExistingHandlers() {
  // Handler para formato de texto
  const formatBtn = document.querySelector("#applyFormat");
  if (formatBtn) {
    formatBtn.addEventListener("click", function(event) {
      console.log('✨ Aplicando formato de texto');
      event.preventDefault();
      toggleTextFormat();
    });
  }
  
  // Handler para generar preview manual
  const generateBtn = document.querySelector("#generatePreview");
  if (generateBtn) {
    generateBtn.addEventListener("click", function(event) {
      console.log('🔄 Generación manual de preview');
      event.preventDefault();
      generatePreview();
    });
  }
  
  // Handler para contrastar encabezados
  const contrastBtn = document.querySelector("#contrastHeadings");
  if (contrastBtn) {
    contrastBtn.addEventListener("click", function(event) {
      console.log('🎨 Contrastando encabezados');
      event.preventDefault();
      contrastHeadings();
    });
  }
  
  console.log('✅ Handlers existentes configurados');
}

// ========================================
// 5. HANDLERS PARA OPTIMIZACIÓN Y UX
// ========================================

/**
 * Configura event handlers adicionales para mejorar la experiencia
 */
function setupOptimizationHandlers() {
  // Handler para redimensionamiento de ventana
  window.addEventListener('resize', function() {
    console.log('📱 Ventana redimensionada');
    adjustResponsiveLayout();
  });
  
  // Handler para teclas de acceso rápido
  document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter para generar preview manual
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      console.log('⌨️ Atajo de teclado: Generar preview');
      generatePreview();
    }
    
    // Ctrl/Cmd + K para limpiar editor
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      console.log('⌨️ Atajo de teclado: Limpiar editor');
      clearEditor();
    }
  });
  
  // Handler para visibilidad de página (cuando el usuario cambia de pestaña)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      console.log('👁️ Usuario regresó a la página');
      // Actualizar timestamp cuando el usuario regresa
      updateLastModified();
    }
  });
  
  console.log('✅ Handlers de optimización configurados');
}

// ========================================
// 6. FUNCIONES AUXILIARES PARA EVENTOS
// ========================================

/**
 * Ajusta el layout responsivo cuando cambia el tamaño de ventana
 */
function adjustResponsiveLayout() {
  const toolbar = document.querySelector(".toolbar");
  
  if (window.innerWidth < 768) {
    // En móvil, mover toolbar abajo
    if (toolbar) {
      toolbar.style.position = 'fixed';
      toolbar.style.bottom = '0';
      toolbar.style.top = 'auto';
    }
  } else {
    // En desktop, toolbar arriba
    if (toolbar) {
      toolbar.style.position = 'sticky';
      toolbar.style.top = '0';
      toolbar.style.bottom = 'auto';
    }
  }
}

/**
 * Maneja errores de event listeners de forma centralizada
 */
function handleEventError(error, eventType) {
  console.error(`❌ Error en event handler (${eventType}):`, error);
  
  // Mostrar mensaje de error no intrusivo
  const errorMsg = document.createElement('div');
  errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
  errorMsg.textContent = `Error en ${eventType}`;
  document.body.appendChild(errorMsg);
  
  // Remover mensaje después de 3 segundos
  setTimeout(() => {
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }, 3000);
}

// ========================================
// 7. INICIALIZACIÓN DE EVENT HANDLERS
// ========================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM completamente cargado');
  initializeEventHandlers();
});

// Inicialización adicional cuando la ventana se carga completamente
window.addEventListener('load', function() {
  console.log('🌐 Ventana completamente cargada');
  
  // Mostrar información sobre atajos de teclado
  console.log(`
  ⌨️ ATAJOS DE TECLADO DISPONIBLES:
  
  • Ctrl/Cmd + Enter: Generar preview manualmente
  • Ctrl/Cmd + K: Limpiar editor
  
  🎮 EVENT HANDLERS ACTIVOS:
  
  • Input automático: Actualiza preview mientras escribes
  • Paste: Actualiza preview al pegar contenido
  • Click en botones: Todas las funcionalidades disponibles
  • Redimensionamiento: Layout responsivo automático
  • Visibilidad: Actualiza timestamp al regresar a la pestaña
  `);
});