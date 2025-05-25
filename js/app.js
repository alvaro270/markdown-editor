// 🎯 APLICACIÓN PRINCIPAL - INTEGRACIÓN CON EVENT HANDLING
// Nuevos conceptos: Event Handling Básico para actualización automática

// ========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ========================================

const generateBtn = document.querySelector("#generatePreview");
const contrastBtn = document.querySelector("#contrastHeadings");
const formatBtn = document.querySelector("#applyFormat");
const clearBtn = document.querySelector("#clearEditor"); // 🆕 HU2
const editor = document.querySelector("#markdownEditor");
const preview = document.querySelector("#htmlPreview");

// 🆕 HU3: Elementos del contador
const wordCountEl = document.querySelector("#wordCount");
const charCountEl = document.querySelector("#charCount");
const charCountNoSpacesEl = document.querySelector("#charCountNoSpaces");
const lastUpdatedEl = document.querySelector("#lastUpdated");

// Variables de estado
let isContrasted = false;
let updateTimeout = null; // Para optimizar las actualizaciones automáticas

// ========================================
// 2. FUNCIÓN MEJORADA PARA CONVERTIR MARKDOWN A HTML
// ========================================

function markdownToHtml(markdown) {
  let html = markdown;

  // Procesar bloques de código
  html = processCodeBlocks(html);
  
  // Procesar listas
  html = processMarkdownLists(html);
  
  // Procesar encabezados
  html = processHeaders(html);
  
  // Procesar párrafos
  html = processParagraphs(html);

  return html;
}

// ========================================
// 3. FUNCIONES AUXILIARES PARA MARKDOWN
// ========================================

function processHeaders(html) {
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  
  // Procesar formato de texto
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function processParagraphs(html) {
  const lines = html.split('\n');
  const result = [];
  let inParagraph = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const isSpecialLine = line.startsWith('<h') || 
                         line.startsWith('<ul') || 
                         line.startsWith('<ol') || 
                         line.startsWith('<li') || 
                         line.startsWith('<pre') || 
                         line.startsWith('</ul>') || 
                         line.startsWith('</ol>') || 
                         line === '';
    
    if (isSpecialLine) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      
      if (line !== '') {
        result.push(line);
      }
    } else {
      if (!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(line);
    }
  }
  
  if (inParagraph) {
    result.push('</p>');
  }
  
  return result.join('\n');
}

// ========================================
// 4. 🆕 HU1: FUNCIÓN PARA ACTUALIZACIÓN AUTOMÁTICA
// ========================================

/**
 * Actualiza la vista previa automáticamente (HU1)
 * Usa debouncing para optimizar rendimiento
 */
function autoUpdatePreview() {
  // Limpiar timeout anterior para evitar actualizaciones excesivas
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  
  // Programar actualización después de 300ms de inactividad
  updateTimeout = setTimeout(() => {
    try {
      const markdownContent = editor.value;
      const htmlContent = markdownToHtml(markdownContent);
      
      preview.innerHTML = htmlContent;
      applySyntaxHighlightingStyles();
      
      // 🆕 HU3: Actualizar contadores al mismo tiempo
      updateCounters();
      
      // Actualizar timestamp
      updateLastModified();
      
      console.log('✅ Vista previa actualizada automáticamente');
      
    } catch (error) {
      console.error('❌ Error en actualización automática:', error);
    }
  }, 300); // 300ms de delay para evitar actualizaciones excesivas
}

// ========================================
// 5. 🆕 HU2: FUNCIÓN PARA LIMPIAR EDITOR
// ========================================

/**
 * Limpia completamente el editor y la vista previa (HU2)
 */
function clearEditor() {
  // Confirmar acción para evitar pérdida accidental
  const confirmClear = confirm('¿Estás seguro de que quieres limpiar todo el contenido?');
  
  if (confirmClear) {
    // Limpiar editor
    editor.value = '';
    
    // Limpiar vista previa
    preview.innerHTML = '<p class="text-gray-500 italic">El editor está vacío. Comienza a escribir para ver la vista previa...</p>';
    
    // 🆕 HU3: Resetear contadores
    resetCounters();
    
    // Enfocar el editor para facilitar escritura inmediata
    editor.focus();
    
    // Feedback visual
    showClearFeedback();
    
    console.log('🗑️ Editor limpiado completamente');
  }
}

// ========================================
// 6. 🆕 HU3: FUNCIONES PARA CONTADOR DE PALABRAS
// ========================================

/**
 * Actualiza los contadores de palabras y caracteres (HU3)
 */
function updateCounters() {
  const text = editor.value;
  
  // Contar palabras (dividir por espacios y filtrar vacíos)
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  // Contar caracteres totales
  const totalChars = text.length;
  
  // Contar caracteres sin espacios
  const charsNoSpaces = text.replace(/\s/g, '').length;
  
  // Actualizar DOM con animación
  animateCounterUpdate(wordCountEl, words);
  animateCounterUpdate(charCountEl, totalChars);
  animateCounterUpdate(charCountNoSpacesEl, charsNoSpaces);
}

/**
 * Anima la actualización de un contador individual
 */
function animateCounterUpdate(element, newValue) {
  const currentValue = parseInt(element.textContent) || 0;
  
  if (currentValue !== newValue) {
    // Agregar clase de animación
    element.classList.add('updated');
    element.textContent = newValue;
    
    // Remover clase después de la animación
    setTimeout(() => {
      element.classList.remove('updated');
    }, 200);
  }
}

/**
 * Resetea todos los contadores a cero
 */
function resetCounters() {
  animateCounterUpdate(wordCountEl, 0);
  animateCounterUpdate(charCountEl, 0);
  animateCounterUpdate(charCountNoSpacesEl, 0);
}

// ========================================
// 7. FUNCIONES DE FEEDBACK VISUAL
// ========================================

function showClearFeedback() {
  clearBtn.textContent = "✅ ¡Limpiado!";
  clearBtn.classList.remove("bg-red-500");
  clearBtn.classList.add("bg-green-600");
  
  setTimeout(() => {
    clearBtn.textContent = "🗑️ Limpiar Editor";
    clearBtn.classList.remove("bg-green-600");
    clearBtn.classList.add("bg-red-500");
  }, 1500);
}

function updateLastModified() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  lastUpdatedEl.textContent = `Actualizado: ${timeString}`;
}

// ========================================
// 8. FUNCIONES EXISTENTES (SIN CAMBIOS IMPORTANTES)
// ========================================

function generatePreview() {
  try {
    const markdownContent = editor.value;
    const htmlContent = markdownToHtml(markdownContent);
    
    preview.innerHTML = htmlContent;
    applySyntaxHighlightingStyles();
    updateCounters(); // 🆕 Actualizar contadores también
    updateLastModified();
    
    showSuccessFeedback();
    console.log('✅ Vista previa generada manualmente');
    
  } catch (error) {
    console.error('❌ Error al generar vista previa:', error);
    showErrorFeedback();
  }
}

function showSuccessFeedback() {
  generateBtn.textContent = "✅ ¡Generado!";
  generateBtn.classList.remove("bg-green-500");
  generateBtn.classList.add("bg-emerald-600");
  
  setTimeout(() => {
    generateBtn.textContent = "🔄 Generar Vista Previa";
    generateBtn.classList.remove("bg-emerald-600");
    generateBtn.classList.add("bg-green-500");
  }, 1500);
}

function showErrorFeedback() {
  generateBtn.textContent = "❌ Error";
  generateBtn.classList.remove("bg-green-500");
  generateBtn.classList.add("bg-red-600");
  
  setTimeout(() => {
    generateBtn.textContent = "🔄 Generar Vista Previa";
    generateBtn.classList.remove("bg-red-600");
    generateBtn.classList.add("bg-green-500");
  }, 2000);
}

function applySyntaxHighlightingStyles() {
  if (!document.getElementById('syntax-styles')) {
    const style = document.createElement('style');
    style.id = 'syntax-styles';
    style.textContent = `
      .keyword { color: #ff79c6; font-weight: bold; }
      .string { color: #f1fa8c; }
      .comment { color: #6272a4; font-style: italic; }
      .py-keyword { color: #ff5555; font-weight: bold; }
      .html-tag { color: #50fa7b; }
    `;
    document.head.appendChild(style);
  }
}

function contrastHeadings() {
  const headings = preview.querySelectorAll("h1, h2, h3, h4, h5, h6");
  
  if (headings.length === 0) {
    alert("⚠️ Primero genera la vista previa para poder contrastar los encabezados");
    return;
  }
  
  isContrasted = !isContrasted;
  
  const applyContrastCallback = function(heading) {
    if (isContrasted) {
      heading.classList.add("contrasted-heading");
      heading.style.fontSize = "1.5em";
      heading.style.marginBottom = "15px";
      heading.style.transform = "scale(1.05)";
      heading.style.transition = "all 0.3s ease";
    } else {
      heading.classList.remove("contrasted-heading");
      heading.style.fontSize = "";
      heading.style.marginBottom = "";
      heading.style.transform = "";
      heading.style.transition = "";
    }
  };
  
  headings.forEach(applyContrastCallback);
  updateContrastButton();
}

function updateContrastButton() {
  if (isContrasted) {
    contrastBtn.textContent = "🎨 Quitar Contraste";
    contrastBtn.classList.remove("bg-purple-500", "hover:bg-purple-600");
    contrastBtn.classList.add("bg-red-500", "hover:bg-red-600");
  } else {
    contrastBtn.textContent = "🎨 Contrastar Encabezados";
    contrastBtn.classList.remove("bg-red-500", "hover:bg-red-600");
    contrastBtn.classList.add("bg-purple-500", "hover:bg-purple-600");
  }
}

// ========================================
// 9. 🆕 EVENT HANDLERS - NUEVAS FUNCIONALIDADES
// ========================================

// 🆕 HU1: Event listener para actualización automática
editor.addEventListener('input', autoUpdatePreview);

// 🆕 HU2: Event listener para limpiar editor
clearBtn.addEventListener('click', clearEditor);

// Event listeners existentes
formatBtn.addEventListener("click", function() {
  console.log('🎯 HU1: Aplicando formato con callbacks...');
  toggleTextFormat();
});

generateBtn.addEventListener("click", function() {
  console.log('🎯 Generando vista previa manualmente...');
  generatePreview();
});

contrastBtn.addEventListener("click", function() {
  console.log('🎨 Aplicando contraste a encabezados...');
  contrastHeadings();
});

// ========================================
// 10. INICIALIZACIÓN
// ========================================

window.addEventListener("load", function() {
  console.log('🚀 Aplicación cargada - Configurando funcionalidades...');
  
  // Generar vista previa inicial
  autoUpdatePreview();
  
  // Mostrar información de nuevas funcionalidades
  console.log(`
  📚 NUEVAS FUNCIONALIDADES AGREGADAS:
  
  🆕 HU1: Preview Automático
  - La vista previa se actualiza automáticamente mientras escribes
  - Sin necesidad de hacer clic en botones
  - Optimizado con debouncing para mejor rendimiento
  
  🆕 HU2: Botón Limpiar Editor
  - Botón rojo "🗑️ Limpiar Editor"
  - Limpia tanto editor como vista previa
  - Incluye confirmación para evitar pérdida accidental
  
  🆕 HU3: Contador Dinámico
  - Contador de palabras en tiempo real
  - Contador de caracteres (con y sin espacios)
  - Animaciones visuales al actualizar números
  - Timestamp de última actualización
  `);
});

// Función de ayuda para mostrar ejemplos
function showExamples() {
  const examples = `# ¡Prueba las Nuevas Funcionalidades!

## 🆕 HU1: Preview Automático
¡Escribe aquí y ve cómo se actualiza automáticamente la vista previa!

## 🆕 HU2: Limpiar Editor
Usa el botón rojo "🗑️ Limpiar Editor" para empezar de nuevo.

## 🆕 HU3: Contadores Dinámicos
Observa cómo los contadores se actualizan mientras escribes:
- Palabras
- Caracteres totales  
- Caracteres sin espacios

### Lista de ejemplo:
1. Primera funcionalidad completada ✅
2. Segunda funcionalidad completada ✅
3. Tercera funcionalidad completada ✅

### Código de ejemplo:
\`\`\`javascript
// ¡El preview se actualiza automáticamente!
console.log("¡Nuevas funcionalidades funcionando!");
\`\`\`

¡Sigue escribiendo para ver las funcionalidades en acción!`;
  
  editor.value = examples;
  // No necesitamos llamar generatePreview() porque se actualiza automáticamente
}

window.showExamples = showExamples;