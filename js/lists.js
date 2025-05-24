// 🎯 HU2: GENERACIÓN DINÁMICA DE LISTAS CON CALLBACKS
// Conceptos clave: Funciones de orden superior para transformar arrays

// ========================================
// 1. FUNCIÓN DE ORDEN SUPERIOR PARA PROCESAR LISTAS
// ========================================

/**
 * Función de orden superior que procesa líneas de texto usando un callback
 * @param {Array} lines - Array de líneas de texto
 * @param {Function} transformCallback - Función que transforma cada línea
 * @param {Function} filterCallback - Función que filtra qué líneas procesar
 * @returns {Array} - Array de líneas transformadas
 */
function processListLines(lines, transformCallback, filterCallback) {
  // 📚 CONCEPTO: Esta función de orden superior:
  // 1. Recibe dos callbacks como parámetros
  // 2. Aplica el filtro para identificar líneas relevantes
  // 3. Usa el callback de transformación para convertir cada línea
  
  return lines
    .filter(filterCallback)  // Filtrar líneas que son elementos de lista
    .map(transformCallback); // Transformar cada línea usando el callback
}

// ========================================
// 2. CALLBACKS PARA DIFERENTES TIPOS DE LISTAS
// ========================================

/**
 * Callback para filtrar líneas que son listas numeradas
 * @param {string} line - Línea de texto
 * @returns {boolean} - true si es una línea de lista numerada
 */
function isNumberedListLine(line) {
  // Regex: línea que empieza con número seguido de punto y espacio
  return /^\d+\.\s+/.test(line.trim());
}

/**
 * Callback para filtrar líneas que son listas con viñetas
 * @param {string} line - Línea de texto
 * @returns {boolean} - true si es una línea de lista con viñetas
 */
function isBulletListLine(line) {
  // Regex: línea que empieza con - o * seguido de espacio
  return /^[\-\*]\s+/.test(line.trim());
}

/**
 * Callback para transformar líneas de lista numerada a HTML
 * @param {string} line - Línea de texto
 * @returns {string} - Línea transformada a <li>
 */
function transformNumberedLine(line) {
  // Extraer el texto después del número y punto
  const text = line.replace(/^\d+\.\s+/, '').trim();
  return `<li>${text}</li>`;
}

/**
 * Callback para transformar líneas de lista con viñetas a HTML
 * @param {string} line - Línea de texto
 * @returns {string} - Línea transformada a <li>
 */
function transformBulletLine(line) {
  // Extraer el texto después del - o *
  const text = line.replace(/^[\-\*]\s+/, '').trim();
  return `<li>${text}</li>`;
}

// ========================================
// 3. FUNCIÓN PRINCIPAL PARA PROCESAR LISTAS
// ========================================

/**
 * Procesa todo el markdown y convierte listas usando callbacks
 * @param {string} markdown - Texto markdown completo
 * @returns {string} - HTML con listas convertidas
 */
function processMarkdownLists(markdown) {
  const lines = markdown.split('\n');
  let result = [];
  let i = 0;
  
  while (i < lines.length) {
    const currentLine = lines[i];
    
    // Verificar si es el inicio de una lista numerada
    if (isNumberedListLine(currentLine)) {
      // 🎯 USAR FUNCIÓN DE ORDEN SUPERIOR PARA PROCESAR LISTA NUMERADA
      const numberedGroup = [];
      
      // Recoger todas las líneas consecutivas de lista numerada
      while (i < lines.length && isNumberedListLine(lines[i])) {
        numberedGroup.push(lines[i]);
        i++;
      }
      
      // Aplicar la función de orden superior con callbacks
      const transformedLines = processListLines(
        numberedGroup,
        transformNumberedLine,  // callback de transformación
        isNumberedListLine      // callback de filtro
      );
      
      // Envolver en <ol>
      result.push('<ol>');
      result.push(...transformedLines);
      result.push('</ol>');
      
      continue; // No incrementar i porque ya se hizo en el while
    }
    
    // Verificar si es el inicio de una lista con viñetas
    else if (isBulletListLine(currentLine)) {
      // 🎯 USAR FUNCIÓN DE ORDEN SUPERIOR PARA PROCESAR LISTA CON VIÑETAS
      const bulletGroup = [];
      
      // Recoger todas las líneas consecutivas de lista con viñetas
      while (i < lines.length && isBulletListLine(lines[i])) {
        bulletGroup.push(lines[i]);
        i++;
      }
      
      // Aplicar la función de orden superior con callbacks
      const transformedLines = processListLines(
        bulletGroup,
        transformBulletLine,    // callback de transformación
        isBulletListLine       // callback de filtro
      );
      
      // Envolver en <ul>
      result.push('<ul>');
      result.push(...transformedLines);
      result.push('</ul>');
      
      continue; // No incrementar i porque ya se hizo en el while
    }
    
    // Si no es una lista, mantener la línea original
    else {
      result.push(currentLine);
      i++;
    }
  }
  
  return result.join('\n');
}

// ========================================
// 4. FUNCIÓN AUXILIAR PARA DEBUGGING
// ========================================

/**
 * Función para mostrar información de debug sobre las listas detectadas
 * @param {string} markdown - Texto markdown
 */
function debugListDetection(markdown) {
  const lines = markdown.split('\n');
  
  console.log('🔍 DETECCIÓN DE LISTAS:');
  lines.forEach((line, index) => {
    if (isNumberedListLine(line)) {
      console.log(`Línea ${index + 1}: Lista numerada - "${line}"`);
    } else if (isBulletListLine(line)) {
      console.log(`Línea ${index + 1}: Lista con viñetas - "${line}"`);
    }
  });
}