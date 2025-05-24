// 🎯 HU1: FUNCIONES DE FORMATO CON CALLBACKS
// Conceptos clave: Funciones de orden superior y callbacks

// Estado para alternar entre negrita y cursiva
let currentFormatType = 'bold'; // 'bold' o 'italic'

// ========================================
// 1. FUNCIÓN DE ORDEN SUPERIOR PARA FORMATO
// ========================================

/**
 * Función de orden superior que aplica formato usando un callback
 * @param {Function} formatCallback - Función que define cómo aplicar el formato
 * @param {string} selectedText - Texto seleccionado para formatear
 * @param {boolean} isFormatted - Si el texto ya tiene formato aplicado
 * @returns {string} - Texto con formato aplicado o removido
 */
function applyTextFormat(formatCallback, selectedText, isFormatted) {
  // 📚 CONCEPTO: Esta es una función de orden superior porque:
  // 1. Recibe una función (formatCallback) como parámetro
  // 2. Ejecuta esa función pasándole datos
  
  return formatCallback(selectedText, isFormatted);
}

// ========================================
// 2. CALLBACKS PARA DIFERENTES FORMATOS
// ========================================

/**
 * Callback para aplicar/quitar formato de negrita
 * @param {string} text - Texto a formatear
 * @param {boolean} isFormatted - Si ya tiene formato
 * @returns {string} - Texto formateado
 */
function boldFormatCallback(text, isFormatted) {
  if (isFormatted) {
    // Quitar formato: **texto** -> texto
    return text.replace(/^\*\*(.*)\*\*$/, '$1');
  } else {
    // Aplicar formato: texto -> **texto**
    return `**${text}**`;
  }
}

/**
 * Callback para aplicar/quitar formato de cursiva
 * @param {string} text - Texto a formatear
 * @param {boolean} isFormatted - Si ya tiene formato
 * @returns {string} - Texto formateado
 */
function italicFormatCallback(text, isFormatted) {
  if (isFormatted) {
    // Quitar formato: *texto* -> texto (sin afectar **)
    return text.replace(/^\*([^*].*[^*])\*$/, '$1');
  } else {
    // Aplicar formato: texto -> *texto*
    return `*${text}*`;
  }
}

// ========================================
// 3. FUNCIÓN PRINCIPAL PARA ALTERNAR FORMATO
// ========================================

/**
 * Función principal que maneja el formato del texto seleccionado
 * Usa funciones de orden superior y callbacks
 */
function toggleTextFormat() {
  const editor = document.getElementById('markdownEditor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  
  // Verificar si hay texto seleccionado
  if (start === end) {
    alert('⚠️ Por favor, selecciona texto para aplicar formato');
    return;
  }
  
  const selectedText = editor.value.substring(start, end);
  const beforeText = editor.value.substring(0, start);
  const afterText = editor.value.substring(end);
  
  // Determinar qué callback usar según el tipo de formato actual
  let formatCallback;
  let isFormatted = false;
  
  if (currentFormatType === 'bold') {
    formatCallback = boldFormatCallback;
    // Verificar si ya tiene formato de negrita
    isFormatted = /^\*\*.*\*\*$/.test(selectedText);
  } else {
    formatCallback = italicFormatCallback;
    // Verificar si ya tiene formato de cursiva (sin **)
    isFormatted = /^\*[^*].*[^*]\*$/.test(selectedText);
  }
  
  // 🎯 USAR LA FUNCIÓN DE ORDEN SUPERIOR
  const formattedText = applyTextFormat(formatCallback, selectedText, isFormatted);
  
  // Reemplazar el texto en el editor
  editor.value = beforeText + formattedText + afterText;
  
  // Mantener la selección en el texto formateado
  const newEnd = start + formattedText.length;
  editor.setSelectionRange(start, newEnd);
  editor.focus();
  
  // Alternar tipo de formato para la próxima vez
  currentFormatType = currentFormatType === 'bold' ? 'italic' : 'bold';
  
  // Actualizar el botón con feedback visual
  updateFormatButton();
}

// ========================================
// 4. FUNCIÓN PARA ACTUALIZAR EL BOTÓN
// ========================================

function updateFormatButton() {
  const button = document.getElementById('applyFormat');
  
  // Efecto visual al hacer clic
  button.classList.add('btn-active');
  
  setTimeout(() => {
    button.classList.remove('btn-active');
    
    // Actualizar texto del botón según el próximo formato
    if (currentFormatType === 'bold') {
      button.textContent = '✨ Aplicar Negrita';
      button.classList.remove('bg-purple-500', 'hover:bg-purple-600');
      button.classList.add('bg-orange-500', 'hover:bg-orange-600');
    } else {
      button.textContent = '✨ Aplicar Cursiva';
      button.classList.remove('bg-orange-500', 'hover:bg-orange-600');
      button.classList.add('bg-purple-500', 'hover:bg-purple-600');
    }
  }, 150);
}