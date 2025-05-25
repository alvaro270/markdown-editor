// 🎯 HU1: EXPORTACIÓN DE CONTENIDO

// 1. FUNCIONES DE EXPORTACIÓN PRINCIPALES

/**
 * Exporta el contenido como archivo Markdown (.md)
 */
function exportAsMarkdown() {
  try {
    const editor = document.querySelector("#markdownEditor");
    const content = editor.value.trim();
    
    // 🎯 Validación con manejo de excepciones
    if (!content) {
      throw new Error("El editor está vacío. No hay contenido para exportar.");
    }
    
    // Crear el archivo y descargarlo
    downloadFile(content, 'documento.md', 'text/markdown');
    
    // Feedback visual exitoso
    showExportSuccess('Markdown', 'exportMarkdown');
    
    console.log('✅ Archivo Markdown exportado exitosamente');
    
  } catch (error) {
    handleExportError(error, 'exportMarkdown');
  }
}

/**
 * Exporta el contenido como archivo HTML (.html)
 */
function exportAsHTML() {
  try {
    const editor = document.querySelector("#markdownEditor");
    const preview = document.querySelector("#htmlPreview");
    const markdownContent = editor.value.trim();
    
    // 🎯 Validación con manejo de excepciones
    if (!markdownContent) {
      throw new Error("El editor está vacío. No hay contenido para exportar.");
    }
    
    // Generar HTML completo con estilos
    const htmlContent = generateCompleteHTML(preview.innerHTML);
    
    // Crear el archivo y descargarlo
    downloadFile(htmlContent, 'documento.html', 'text/html');
    
    // Feedback visual exitoso
    showExportSuccess('HTML', 'exportHTML');
    
    console.log('✅ Archivo HTML exportado exitosamente');
    
  } catch (error) {
    handleExportError(error, 'exportHTML');
  }
}

// ========================================
// 2. FUNCIONES AUXILIARES
// ========================================

/**
 * Descarga un archivo usando Blob API
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 */
function downloadFile(content, filename, mimeType) {
  try {
    // Crear Blob con el contenido
    const blob = new Blob([content], { type: mimeType });
    
    // Crear URL temporal para el blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento de descarga temporal
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Limpiar URL temporal para liberar memoria
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    throw new Error(`Error al crear archivo de descarga: ${error.message}`);
  }
}

/**
 * Genera HTML completo con estructura y estilos
 * @param {string} htmlContent - Contenido HTML del preview
 * @returns {string} - HTML completo
 */
function generateCompleteHTML(htmlContent) {
  const currentDate = new Date().toLocaleDateString('es-ES');
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Exportado - ${currentDate}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2em;
            margin-bottom: 1em;
        }
        pre {
            background: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
        }
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        ul, ol {
            margin-left: 20px;
        }
        .export-info {
            border-top: 2px solid #3498db;
            margin-top: 40px;
            padding-top: 20px;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    ${htmlContent}
    
    <div class="export-info">
        <p><strong>Documento exportado el:</strong> ${currentDate}</p>
        <p><strong>Generado con:</strong> Editor Avanzado de Markdown</p>
    </div>
</body>
</html>`;
}

// ========================================
// 3. MANEJO DE ERRORES Y FEEDBACK
// ========================================

/**
 * Maneja errores de exportación
 * @param {Error} error - Error ocurrido
 * @param {string} buttonId - ID del botón que causó el error
 */
function handleExportError(error, buttonId) {
  console.error('❌ Error en exportación:', error);
  
  // Mostrar notificación de error
  showExportNotification(error.message, 'error');
  
  // Feedback visual en el botón
  showExportError(buttonId);
}

/**
 * Muestra feedback de éxito en exportación
 * @param {string} fileType - Tipo de archivo exportado
 * @param {string} buttonId - ID del botón
 */
function showExportSuccess(fileType, buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  const originalText = button.textContent;
  const originalClasses = button.className;
  
  button.textContent = `✅ ${fileType} Descargado`;
  button.className = button.className.replace(/bg-\w+-\d+/, 'bg-green-600');
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
    button.disabled = false;
  }, 2000);
}

/**
 * Muestra feedback de error en exportación
 * @param {string} buttonId - ID del botón
 */
function showExportError(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  const originalText = button.textContent;
  const originalClasses = button.className;
  
  button.textContent = '❌ Error al Exportar';
  button.className = button.className.replace(/bg-\w+-\d+/, 'bg-red-600');
  
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, 3000);
}

/**
 * Muestra notificación de exportación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - 'success' o 'error'
 */
function showExportNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '📥' : '⚠️';
  
  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md notification-enter`;
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="text-xl">${icon}</span>
      <div>
        <div class="font-semibold">${type === 'success' ? 'Exportación Exitosa' : 'Error de Exportación'}</div>
        <div class="text-sm opacity-90">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">✕</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}