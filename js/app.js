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

// 2. FUNCIÓN MEJORADA CON MANEJO DE EXCEPCIONES Y MARKED
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

  
  try {
    // 🎯 HU1: Validación de entrada vacía
    if (!markdown || markdown.trim() === "") {
      throw new Error("No se ingresó contenido");
    }

    // 🎯 HU2: Validación de sintaxis Markdown mal formada
    validateMarkdownSyntax(markdown);

    // 🎯 HU3: Usar librería Marked con manejo de errores
    let html;
    try {
      html = marked.parse(markdown);
    } catch (markedError) {
      console.error("❌ Error en conversión con Marked:", markedError);
      throw new Error(
        "Error interno durante la conversión. Por favor, revisa tu sintaxis Markdown."
      );
    }

  } catch (error) {
    // Manejo centralizado de errores
    handleMarkdownError(error);
    return generateErrorHTML(error.message);
  }
  return html;
}

// 🎯 HU2: Función para validar sintaxis Markdown
function validateMarkdownSyntax(markdown) {
  const lines = markdown.split("\n");

  lines.forEach((line, index) => {
    // Detectar encabezados mal formados (sin espacio después de #)
    if (/^#{1,6}[^#\s]/.test(line.trim())) {
      throw new Error(
        `Encabezado mal formado en línea ${
          index + 1
        }: "${line.trim()}". Falta espacio después de #`
      );
    }

    // Detectar listas mal formadas (sin espacio después de - o *)
    if (/^[-*][^\s]/.test(line.trim())) {
      throw new Error(
        `Lista mal formada en línea ${
          index + 1
        }: "${line.trim()}". Falta espacio después de - o *`
      );
    }
  });
}

// 🎯 HU3: Función para manejar errores de manera amigable
function handleMarkdownError(error) {
  console.error("❌ Error en procesamiento de Markdown:", error);

  // Mostrar notificación visual al usuario
  showErrorNotification(error.message);
}

// Función para mostrar notificación de error
function showErrorNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md";
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="text-xl">⚠️</span>
      <div>
        <div class="font-semibold">Error de Markdown</div>
        <div class="text-sm opacity-90">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">✕</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remover después de 8 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 8000);
}

// Función para generar HTML de error amigable
function generateErrorHTML(errorMessage) {
  return `
    <div class="error-container bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <div class="flex items-center gap-3">
        <span class="text-2xl">⚠️</span>
        <div>
          <h3 class="text-red-800 font-semibold">Error en el Markdown</h3>
          <p class="text-red-600 text-sm mt-1">${errorMessage}</p>
          <p class="text-red-500 text-xs mt-2">💡 Tip: Revisa tu syntaxe y vuelve a intentar</p>
        </div>
      </div>
    </div>
  `;
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
  const lines = html.split("\n");
  const result = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const isSpecialLine =
      line.startsWith("<h") ||
      line.startsWith("<ul") ||
      line.startsWith("<ol") ||
      line.startsWith("<li") ||
      line.startsWith("<pre") ||
      line.startsWith("</ul>") ||
      line.startsWith("</ol>") ||
      line === "";

    if (isSpecialLine) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }

      if (line !== "") {
        result.push(line);
      }
    } else {
      if (!inParagraph) {
        result.push("<p>");
        inParagraph = true;
      }
      result.push(line);
    }
  }

  if (inParagraph) {
    result.push("</p>");
  }

  return result.join("\n");
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

      // 🎯 HU1: Validación mejorada antes de procesar
      if (!markdownContent || markdownContent.trim() === "") {
        preview.innerHTML =
          '<p class="text-gray-500 italic">El editor está vacío. Comienza a escribir para ver la vista previa...</p>';
        resetCounters();
        return;
      }

      const htmlContent = markdownToHtml(markdownContent);
      preview.innerHTML = htmlContent;

      // Actualizar contadores y timestamp
      updateCounters();
      updateLastModified();

      console.log("✅ Vista previa actualizada automáticamente");
    } catch (error) {
      console.error("❌ Error en actualización automática:", error);
      // No mostrar notificación aquí para evitar spam, ya se maneja en markdownToHtml
    }
  }, 300);
}

// ========================================
// 5. 🆕 HU2: FUNCIÓN PARA LIMPIAR EDITOR
// ========================================

/**
 * Limpia completamente el editor y la vista previa (HU2)
 */
function clearEditor() {
  // Confirmar acción para evitar pérdida accidental
  const confirmClear = confirm(
    "¿Estás seguro de que quieres limpiar todo el contenido?"
  );

  if (confirmClear) {
    // Limpiar editor
    editor.value = "";

    // Limpiar vista previa
    preview.innerHTML =
      '<p class="text-gray-500 italic">El editor está vacío. Comienza a escribir para ver la vista previa...</p>';

    // 🆕 HU3: Resetear contadores
    resetCounters();

    // Enfocar el editor para facilitar escritura inmediata
    editor.focus();

    // Feedback visual
    showClearFeedback();

    console.log("🗑️ Editor limpiado completamente");
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
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Contar caracteres totales
  const totalChars = text.length;

  // Contar caracteres sin espacios
  const charsNoSpaces = text.replace(/\s/g, "").length;

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
    element.classList.add("updated");
    element.textContent = newValue;

    // Remover clase después de la animación
    setTimeout(() => {
      element.classList.remove("updated");
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
  const timeString = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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
    updateCounters();
    updateLastModified();

    showSuccessFeedback();
    console.log("✅ Vista previa generada manualmente");
  } catch (error) {
    console.error("❌ Error al generar vista previa:", error);
    showErrorFeedback();
    // El error ya se maneja en markdownToHtml, no necesitamos hacer nada más aquí
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
  if (!document.getElementById("syntax-styles")) {
    const style = document.createElement("style");
    style.id = "syntax-styles";
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
    alert(
      "⚠️ Primero genera la vista previa para poder contrastar los encabezados"
    );
    return;
  }

  isContrasted = !isContrasted;

  const applyContrastCallback = function (heading) {
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
editor.addEventListener("input", autoUpdatePreview);

// 🆕 HU2: Event listener para limpiar editor
clearBtn.addEventListener("click", clearEditor);

// Event listeners existentes
formatBtn.addEventListener("click", function () {
  console.log("🎯 HU1: Aplicando formato con callbacks...");
  toggleTextFormat();
});

generateBtn.addEventListener("click", function () {
  console.log("🎯 Generando vista previa manualmente...");
  generatePreview();
});

contrastBtn.addEventListener("click", function () {
  console.log("🎨 Aplicando contraste a encabezados...");
  contrastHeadings();
});

// ========================================
// 10. INICIALIZACIÓN
// ========================================

window.addEventListener("load", function () {
  console.log("🚀 Aplicación cargada - Configurando funcionalidades...");

  // Generar vista previa inicial
  autoUpdatePreview();

  // 🆕 Inicializar sistema de temas
initializeThemeSystem();

// Mostrar información de las nuevas funcionalidades
console.log(`
📚 NUEVAS FUNCIONALIDADES HU1 y HU2:

🆕 HU1: Exportación de Contenido
- Botón "📥 Exportar MD" - Descarga archivo .md
- Botón "📄 Exportar HTML" - Descarga archivo .html completo
- Validación de contenido vacío con manejo de excepciones
- Feedback visual en botones y notificaciones

🆕 HU2: Modo Oscuro/Claro  
- Botón "🌙 Modo Oscuro / ☀️ Modo Claro"
- Toggle completo de toda la interfaz
- Persistencia durante la sesión actual
- Transiciones suaves entre temas
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
