// 🎯 HU3: RESALTADO DE CÓDIGO CON FUNCIONES DE PRIMERA CLASE
// Conceptos clave: Funciones como ciudadanos de primera clase

// ========================================
// 1. FUNCIONES DE PRIMERA CLASE PARA TRANSFORMACIÓN DE CÓDIGO
// ========================================

/**
 * Función de primera clase para detectar bloques de código
 * Esta función puede ser asignada a variables, pasada como parámetro, etc.
 */
const detectCodeBlocks = function(markdown) {
  // 📚 CONCEPTO: Esta es una función de primera clase porque:
  // 1. Está almacenada en una variable (const)
  // 2. Puede ser pasada como argumento a otras funciones
  // 3. Puede ser retornada por otras funciones
  
  // Regex para detectar bloques de código con triple backticks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const matches = [];
  let match;
  
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    matches.push({
      fullMatch: match[0],        // Todo el bloque incluyendo ```
      language: match[1] || '',   // Lenguaje especificado (opcional)
      code: match[2].trim(),      // Código sin los backticks
      startIndex: match.index,    // Posición donde empieza
      endIndex: match.index + match[0].length // Posición donde termina
    });
  }
  
  return matches;
};

/**
 * Función de primera clase para aplicar resaltado a un bloque de código
 */
const highlightCodeBlock = function(codeBlock) {
  // Aplicar transformaciones de resaltado básico
  let highlightedCode = codeBlock.code;
  
  // Resaltar palabras clave comunes de JavaScript
  const jsKeywords = [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 
    'return', 'class', 'extends', 'import', 'export', 'async', 'await'
  ];
  
  // Solo aplicar resaltado de JS si el lenguaje es javascript o está vacío
  if (codeBlock.language === 'javascript' || codeBlock.language === 'js' || codeBlock.language === '') {
    jsKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Resaltar strings
    highlightedCode = highlightedCode.replace(
      /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, 
      '<span class="string">$1$2$3</span>'
    );
    
    // Resaltar comentarios
    highlightedCode = highlightedCode.replace(
      /\/\/(.*$)/gm, 
      '<span class="comment">//$1</span>'
    );
  }
  
  return highlightedCode;
};

/**
 * Función de primera clase para generar HTML de bloque de código
 */
const generateCodeBlockHTML = function(codeBlock) {
  const highlightedCode = highlightCodeBlock(codeBlock);
  const languageLabel = codeBlock.language ? ` data-language="${codeBlock.language}"` : '';
  
  return `<pre class="code-block"${languageLabel}><code>${highlightedCode}</code></pre>`;
};

// ========================================
// 2. FUNCIÓN PRINCIPAL PARA PROCESAR CÓDIGO
// ========================================

/**
 * Función principal que utiliza las funciones de primera clase
 * para transformar bloques de código en el markdown
 * @param {string} markdown - Texto markdown original
 * @returns {string} - Markdown con bloques de código transformados
 */
function processCodeBlocks(markdown) {
  // 🎯 USAR FUNCIÓN DE PRIMERA CLASE PARA DETECTAR BLOQUES
  const codeBlocks = detectCodeBlocks(markdown);
  
  if (codeBlocks.length === 0) {
    return markdown; // No hay bloques de código
  }
  
  // Procesar bloques en orden inverso para mantener los índices correctos
  let processedMarkdown = markdown;
  
  for (let i = codeBlocks.length - 1; i >= 0; i--) {
    const block = codeBlocks[i];
    
    // 🎯 USAR FUNCIONES DE PRIMERA CLASE PARA GENERAR HTML
    const htmlBlock = generateCodeBlockHTML(block);
    
    // Reemplazar el bloque original con el HTML generado
    processedMarkdown = processedMarkdown.substring(0, block.startIndex) +
                       htmlBlock +
                       processedMarkdown.substring(block.endIndex);
  }
  
  return processedMarkdown;
}

// ========================================
// 3. FUNCIONES DE PRIMERA CLASE PARA DIFERENTES LENGUAJES
// ========================================

/**
 * Objeto que contiene funciones de primera clase para diferentes lenguajes
 * Cada función puede ser llamada dinámicamente según el lenguaje detectado
 */
const languageHighlighters = {
  // Función para JavaScript
  javascript: function(code) {
    return highlightCodeBlock({ code, language: 'javascript' });
  },
  
  // Función para Python (básico)
  python: function(code) {
    const pythonKeywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return'];
    let highlighted = code;
    
    pythonKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="py-keyword">${keyword}</span>`);
    });
    
    return highlighted;
  },
  
  // Función para HTML
  html: function(code) {
    // Resaltar etiquetas HTML
    return code.replace(/<(\/?[\w\s="'-]+)>/g, '<span class="html-tag">&lt;$1&gt;</span>');
  }
};

/**
 * Función que utiliza el objeto de funciones de primera clase
 * para aplicar el resaltado correcto según el lenguaje
 * @param {Object} codeBlock - Objeto con información del bloque de código
 * @returns {string} - Código con resaltado aplicado
 */
function applyLanguageSpecificHighlighting(codeBlock) {
  const lang = codeBlock.language.toLowerCase();
  
  // Verificar si tenemos una función específica para este lenguaje
  if (languageHighlighters[lang]) {
    // 🎯 LLAMAR FUNCIÓN DE PRIMERA CLASE DINÁMICAMENTE
    return languageHighlighters[lang](codeBlock.code);
  }
  
  // Si no hay función específica, usar resaltado genérico
  return highlightCodeBlock(codeBlock);
}

// ========================================
// 4. FUNCIÓN DE DEBUG PARA BLOQUES DE CÓDIGO
// ========================================

/**
 * Función de debug para mostrar información sobre bloques detectados
 * @param {string} markdown - Texto markdown
 */
function debugCodeBlocks(markdown) {
  const blocks = detectCodeBlocks(markdown);
  
  console.log('🔍 BLOQUES DE CÓDIGO DETECTADOS:');
  blocks.forEach((block, index) => {
    console.log(`Bloque ${index + 1}:`);
    console.log(`  - Lenguaje: ${block.language || 'sin especificar'}`);
    console.log(`  - Código: ${block.code.substring(0, 50)}...`);
    console.log(`  - Posición: ${block.startIndex} - ${block.endIndex}`);
  });
}