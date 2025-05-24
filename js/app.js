// 🎯 APLICACIÓN PRINCIPAL - INTEGRACIÓN DE TODOS LOS MÓDULOS
// Conceptos integrados: DOM, Callbacks, Funciones de orden superior

// ========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ========================================

const generateBtn = document.querySelector("#generatePreview");
const contrastBtn = document.querySelector("#contrastHeadings");
const formatBtn = document.querySelector("#applyFormat");
const editor = document.querySelector("#markdownEditor");
const preview = document.querySelector("#htmlPreview");

// Variable para controlar el estado del contraste
let isContrasted = false;

// ========================================
// 2. FUNCIÓN MEJORADA PARA CONVERTIR MARKDOWN A HTML
// ========================================

function markdownToHtml(markdown) {
  let html = markdown;

  // 🎯 PASO 1: PROCESAR BLOQUES DE CÓDIGO (HU3)
  // Usar funciones de primera clase para el resaltado
  html = processCodeBlocks(html);

  // 🎯 PASO 2: PROCESAR LISTAS (HU2)
  // Usar funciones de orden superior con callbacks
  html = processMarkdownLists(html);

  // 🎯 PASO 3: PROCESAR ENCABEZADOS (funcionalidad original mejorada)
  html = processHeaders(html);

  // 🎯 PASO 4: PROCESAR PÁRRAFOS
  html = processParagraphs(html);

  return html;
}

// ========================================
// 3. FUNCIONES AUXILIARES PARA MARKDOWN
// ========================================

/**
 * Procesa encabezados usando regex mejorado
 * @param {string} html - HTML en proceso
 * @returns {string} - HTML con encabezados procesados
 */
function processHeaders(html) {
  // Regex mejorado para encabezados
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  //  PROCESAR FORMATO DE TEXTO (NEGRITA Y CURSIVA)
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

/**
 * Procesa párrafos evitando conflictos con listas y código
 * @param {string} html - HTML en proceso
 * @returns {string} - HTML con párrafos procesados
 */
function processParagraphs(html) {
  // Dividir en líneas para procesar párrafos
  const lines = html.split('\n');
  const result = [];
  let inParagraph = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectar si es una línea que no debe estar en párrafo
    const isSpecialLine = line.startsWith('<h') || 
                         line.startsWith('<ul') || 
                         line.startsWith('<ol') || 
                         line.startsWith('<li') || 
                         line.startsWith('<pre') || 
                         line.startsWith('</ul>') || 
                         line.startsWith('</ol>') || 
                         line === '';
    
    if (isSpecialLine) {
      // Cerrar párrafo si estaba abierto
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      
      // Añadir la línea especial
      if (line !== '') {
        result.push(line);
      }
    } else {
      // Es contenido de párrafo
      if (!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(line);
    }
  }
  
  // Cerrar párrafo final si está abierto
  if (inParagraph) {
    result.push('</p>');
  }
  
  return result.join('\n');
}

// ========================================
// 4. FUNCIÓN PRINCIPAL PARA GENERAR VISTA PREVIA
// ========================================

function generatePreview() {
  try {
    // Obtener contenido del editor
    const markdownContent = editor.value;
    
    // 🎯 INTEGRAR TODAS LAS FUNCIONALIDADES
    // 1. Procesar con funciones de orden superior y callbacks
    const htmlContent = markdownToHtml(markdownContent);
    
    // 2. Insertar HTML en el preview
    preview.innerHTML = htmlContent;
    
    // 3. Aplicar estilos CSS adicionales para código
    applySyntaxHighlightingStyles();
    
    // 4. Feedback visual mejorado
    showSuccessFeedback();
    
    // 🔍 DEBUG: Mostrar información en consola
    console.log('✅ Vista previa generada exitosamente');
    debugCodeBlocks(markdownContent);
    debugListDetection(markdownContent);
    
  } catch (error) {
    console.error('❌ Error al generar vista previa:', error);
    showErrorFeedback();
  }
}

// ========================================
// 5. FUNCIONES DE FEEDBACK VISUAL
// ========================================

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

// ========================================
// 6. FUNCIÓN PARA APLICAR ESTILOS DE SINTAXIS
// ========================================

function applySyntaxHighlightingStyles() {
  // Crear estilos dinámicos para resaltado de sintaxis
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

// ========================================
// 7. FUNCIÓN PARA CONTRASTAR ENCABEZADOS (MEJORADA)
// ========================================

function contrastHeadings() {
  const headings = preview.querySelectorAll("h1, h2, h3, h4, h5, h6");
  
  if (headings.length === 0) {
    alert("⚠️ Primero genera la vista previa para poder contrastar los encabezados");
    return;
  }
  
  // Toggle del contraste
  isContrasted = !isContrasted;
  
  // Usar callback para aplicar estilos a cada encabezado
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
  
  // 🎯 APLICAR CALLBACK A CADA ENCABEZADO
  headings.forEach(applyContrastCallback);
  
  // Actualizar botón
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
// 8. EVENT LISTENERS PRINCIPALES
// ========================================

// HU1: Evento para aplicar formato
formatBtn.addEventListener("click", function() {
  console.log('🎯 HU1: Aplicando formato con callbacks...');
  toggleTextFormat();
});

// Evento para generar preview (integra HU2 y HU3)
generateBtn.addEventListener("click", function() {
  console.log('🎯 HU2 & HU3: Generando vista previa con funciones de orden superior...');
  generatePreview();
});

// Evento para contrastar encabezados
contrastBtn.addEventListener("click", function() {
  console.log('🎨 Aplicando contraste a encabezados...');
  contrastHeadings();
});

// ========================================
// 9. FUNCIONES DE INICIALIZACIÓN
// ========================================

// Generar preview automáticamente al cargar
window.addEventListener("load", function() {
  console.log('🚀 Aplicación cargada - Generando vista previa inicial...');
  generatePreview();
  
  // Mostrar información de funcionalidades en consola
  console.log(`
  📚 FUNCIONALIDADES DISPONIBLES:
  
  🎯 HU1: Formato de Texto (Funciones de Orden Superior)
  - Selecciona texto y haz clic en "Aplicar Formato"
  - Alterna entre negrita (**texto**) y cursiva (*texto*)
  
  🎯 HU2: Listas Dinámicas (Callbacks)
  - Escribe listas numeradas: 1. Item 1, 2. Item 2
  - Escribe listas con viñetas: - Item o * Item
  - Se procesan automáticamente al generar vista previa
  
  🎯 HU3: Resaltado de Código (Funciones de Primera Clase)
  - Usa triple backticks para bloques de código: \`\`\`javascript
  - Soporte para JavaScript, Python, HTML
  - Resaltado automático de sintaxis
  `);
});

// Ajuste responsivo de toolbar
function adjustToolbarPosition() {
  const toolbar = document.querySelector(".toolbar");
  if (window.innerWidth < 768) {
    toolbar.classList.remove("top-20", "md:top-16");
    toolbar.classList.add("bottom-0");
  } else {
    toolbar.classList.remove("bottom-0");
    toolbar.classList.add("top-20", "md:top-16");
  }
}

window.addEventListener("load", adjustToolbarPosition);
window.addEventListener("resize", adjustToolbarPosition);

// ========================================
// 10. FUNCIÓN DE AYUDA PARA ESTUDIANTES
// ========================================

/**
 * Función para mostrar ejemplos de cada funcionalidad
 * Útil para entender cómo funcionan los callbacks
 */
function showExamples() {
  const examples = `
# Ejemplos de Funcionalidades

## HU1: Formato de Texto
Selecciona este texto y usa el botón "Aplicar Formato"

## HU2: Listas Automáticas

### Lista Numerada:
1. Primer elemento
2. Segundo elemento
3. Tercer elemento

### Lista con Viñetas:
- Elemento A
- Elemento B
- Elemento C

## HU3: Resaltado de Código

\`\`\`javascript
function ejemplo() {
  const mensaje = "¡Hola Mundo!";
  console.log(mensaje);
  return true;
}
\`\`\`

\`\`\`python
def ejemplo():
    mensaje = "¡Hola Python!"
    print(mensaje)
    return True
\`\`\`
  `;
  
  editor.value = examples;
  generatePreview();
}

// Agregar función de ayuda al objeto global para fácil acceso
window.showExamples = showExamples;