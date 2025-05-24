// 🎯 CONCEPTOS CLAVE QUE ESTAMOS APRENDIENDO:
// 1. DOM como Árbol de Objetos
// 2. Selección dinámica de Nodos
// 3. Regex básico

// ========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ========================================

// Usando querySelector para seleccionar UN elemento
const generateBtn = document.querySelector("#generatePreview");
const contrastBtn = document.querySelector("#contrastHeadings");
const editor = document.querySelector("#markdownEditor");
const preview = document.querySelector("#htmlPreview");

// Variable para controlar el estado del contraste
let isContrasted = false;

// ========================================
// 2. FUNCIÓN PARA CONVERTIR MARKDOWN A HTML
// ========================================

function markdownToHtml(markdown) {
  let html = markdown;

  // 🔍 REGEX PARA ENCABEZADOS
  // Explicación: ^ = inicio de línea, #{1,6} = de 1 a 6 símbolos #, \s+ = espacios, (.+) = captura el texto
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>"); // # Título -> <h1>
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>"); // ## Título -> <h2>
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>"); // ### Título -> <h3>
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>"); // #### Título -> <h4>
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>"); // ##### Título -> <h5>
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>"); // ###### Título -> <h6>

  // 🔍 REGEX PARA LISTAS NO ORDENADAS
  // Primero convertimos cada línea que empiece con - o * en un <li>
  html = html.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>");

  // Luego envolvemos grupos consecutivos de <li> en <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, function (match) {
    return "<ul>" + match + "</ul>";
  });

  // 🔍 REGEX PARA LISTAS ORDENADAS
  // Convertimos líneas que empiecen con número seguido de punto
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Envolvemos <li> sin <ul> en <ol> (para listas numeradas)
  html = html.replace(/(<li>(?!.*<\/ul>).*<\/li>)/gs, function (match) {
    if (!match.includes("<ul>")) {
      return "<ol>" + match + "</ol>";
    }
    return match;
  });

  // 🔍 REGEX PARA PÁRRAFOS
  // Convertir saltos de línea dobles en párrafos
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Limpiar párrafos vacíos y mal formados
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ol>)/g, "$1");
  html = html.replace(/(<\/ol>)<\/p>/g, "$1");

  return html;
}

// ========================================
// 3. FUNCIÓN PARA GENERAR VISTA PREVIA
// ========================================

function generatePreview() {
  // Obtenemos el contenido del editor
  const markdownContent = editor.value;

  // Convertimos Markdown a HTML usando nuestras regex
  const htmlContent = markdownToHtml(markdownContent);

  // Insertamos el HTML en el área de preview
  preview.innerHTML = htmlContent;

  // Feedback visual
  generateBtn.textContent = "✅ ¡Generado!";
  generateBtn.classList.add("bg-green-600");

  setTimeout(() => {
    generateBtn.textContent = "🔄 Generar Vista Previa";
    generateBtn.classList.remove("bg-green-600");
  }, 1500);
}

// ========================================
// 4. FUNCIÓN PARA CONTRASTAR ENCABEZADOS
// ========================================

function contrastHeadings() {
  // 🎯 USANDO querySelectorAll para seleccionar TODOS los encabezados
  // Esto nos devuelve un NodeList con todos los elementos h1, h2, h3, h4, h5, h6
  const headings = preview.querySelectorAll("h1, h2, h3, h4, h5, h6");

  // Verificamos si hay encabezados para contrastar
  if (headings.length === 0) {
    alert(
      "⚠️ Primero genera la vista previa para poder contrastar los encabezados"
    );
    return;
  }

  // Toggle del contraste
  isContrasted = !isContrasted;

  // 🔄 ITERAMOS sobre cada encabezado y aplicamos/quitamos estilos
  headings.forEach(function (heading) {
    if (isContrasted) {
      // Aplicar contraste
      heading.classList.add("contrasted-heading");
      heading.style.fontSize = "1.5em";
      heading.style.marginBottom = "15px";
    } else {
      // Quitar contraste
      heading.classList.remove("contrasted-heading");
      heading.style.fontSize = "";
      heading.style.marginBottom = "";
    }
  });

  // Actualizar el botón
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
// 5. EVENT LISTENERS (ESCUCHADORES DE EVENTOS)
// ========================================

// Evento click para generar preview
generateBtn.addEventListener("click", generatePreview);

// Evento click para contrastar encabezados
contrastBtn.addEventListener("click", contrastHeadings);

// 🚀 BONUS: Generar preview automáticamente al cargar la página
window.addEventListener("load", function () {
  generatePreview();
});

// 📱 RESPONSIVE: Mover toolbar en mobile
function adjustToolbarPosition() {
  const toolbar = document.querySelector(".toolbar");
  if (window.innerWidth < 768) {
    // Mobile: toolbar abajo
    toolbar.classList.remove("top-20", "md:top-16");
    toolbar.classList.add("bottom-0");
  } else {
    // Desktop: toolbar arriba
    toolbar.classList.remove("bottom-0");
    toolbar.classList.add("top-20", "md:top-16");
  }
}

// Ajustar posición al cargar y al redimensionar
window.addEventListener("load", adjustToolbarPosition);
window.addEventListener("resize", adjustToolbarPosition);
