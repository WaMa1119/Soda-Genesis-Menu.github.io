const form = document.getElementById("form");
const menuDiv = document.getElementById("menu");
const predefDiv = document.getElementById("predefinidos");
const cancelarBtn = document.getElementById("cancelar");
const fontSelect = document.getElementById("fontFamilySelect");
const lineDownBtn = document.getElementById("linedown");


const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const descripcionInput = document.getElementById("descripcion");
const colorInput = document.getElementById("colorPlatillo");

let menu = JSON.parse(localStorage.getItem("menu")) || [];
let editIndex = null;

/* ---------------- PREDEFINIDOS (IGUAL QUE ANTES) ---------------- */
const predefinidos = {
  "Casados": [
    { nombre: "Casado con:", descripcion: "Arroz, frijoles, ensalada y guarnición (Incluye refresco)" }, 
    { nombre: "Carne en salsa", precio: "3900", descripcion:""},
    { nombre: "Bistec", precio: "3800", descripcion:""},
    { nombre: "Bistec de cerdo", precio: "3800", descripcion:""},
    { nombre: "Chuleta ", precio: "3800", descripcion:""},
    { nombre: "Chuleta ahumada", precio: "3800", descripcion:""},
    { nombre: "Torta de carne", precio: "3700", descripcion:""},
    { nombre: "Pescado", precio: "3800", descripcion:""},
    { nombre: "Pollo en salsa", precio: "3800", descripcion:""},
    { nombre: "Pollo a la plancha", precio: "3900", descripcion:""},
    { nombre: "Pollo a la milanesa", precio: "3900", descripcion:""},
    { nombre: "Fajitas de res", precio: "4000", descripcion:""},
    { nombre: "Fajitas de pollo", precio: "4000", descripcion:""},
    { nombre: "Fajitas mixtas", precio: "4300", descripcion:""},
    { nombre: "Hígado", precio: "3800", descripcion:""},
    { nombre: "Canelones rellenos", precio: "3800", descripcion:""},
    { nombre: "Costilla al horno", precio: "?", descripcion:""},
    { nombre: "Chicharrón", precio: "4300", descripcion:""},
    { nombre: "Pollo achiotado", precio: "4300", descripcion:""},
    { nombre: "Pollo con papas", precio: "?", descripcion:""},
    { nombre: "Papas con chorizo", precio: "?", descripcion:""},
    { nombre: "Mondongo en salsa", precio: "?", descripcion:""},
    { nombre: "Pollo caribeño", precio: "?", descripcion:""},
    { nombre: "Espaguetis salsa y queso", precio: "3800", descripcion:""}
  ],
  "Almuerzos": [
    { nombre: "Almuerzos", descripcion: "(Incluye refresco)" },
    { nombre: "Chifrijo", precio: "?", descripcion: "Arroz, frijoles, chicharrón, pico de gallo y tortilla frita." },
    { nombre: "Olla de carne", precio: "?", descripcion: "Sopa típica de carne de Costa Rica." },
    { nombre: "Sopa negra", precio: "?", descripcion: "Sopa de frijoles condimentados, huevo duro." },
    { nombre: "Sopa de pollo", precio: "?", descripcion: "Sopa típica que incluye pollo." },
    { nombre: "Sopa de mariscos", precio: "?", descripcion: "Sopa típica que incluye mariscos." },
    { nombre: "Sopa azteca", precio: "?", descripcion: "Sopa típica mexicana de tomate y aguacate." },
    { nombre: "Arroz con pollo", precio: "4200", descripcion: "Arroz con pollo desmenuzado y vegetales." },
    { nombre: "Arroz con camarones", precio: "4500", descripcion: "Arroz frito con camarones y vegetales." },
    { nombre: "Hamburguesa con papas", precio: "3800", descripcion: "Hamburguesa clásica con papas fritas." },
    { nombre: "Salchipapas", precio: "2800", descripcion: "Papas fritas y salchicha." },
    { nombre: "Papas supreme", precio: "4500", descripcion: "Papas fritas con carne y topings." }
    
  ],
  "Bebidas": [
    { nombre: "Bebidas", precio: "", descripcion: "" },
    { nombre: "Te frio", precio: "850", descripcion: "" },
    { nombre: "Horchata", precio: "850", descripcion: "" },
    { nombre: "Piña", precio: "850", descripcion: "" },
    { nombre: "Cas", precio: "850", descripcion: "" },
    { nombre: "Carambola", precio: "850", descripcion: "" },
    { nombre: "Tamarindo", precio: "850", descripcion: "" },
    { nombre: "Gaseosa", precio: "850", descripcion: "" },
  ],
  "Batidos": [
    { nombre: "Batidos", precio: "", descripcion: "" },
    { nombre: "Mora", precio: "1800 agua , ₡2000 leche", descripcion: "" },
    { nombre: "Papaya", precio: "1800 agua , ₡2000 leche", descripcion: "" },
    { nombre: "Guanábana", precio: "1800 agua , ₡2000 leche", descripcion: "" },
    { nombre: "Sandia", precio: "1800 agua , ₡2000 leche", descripcion: "" },
    { nombre: "Verde", precio: "1800 agua , ₡2000 leche", descripcion: "" },
    { nombre: "Fresa", precio: "1800 agua , ₡2000 leche", descripcion: "" },
  ],
  "Postres": [
    { nombre: "Postres", precio: "", descripcion: "" },
    { nombre: "Arroz con leche", precio: "?", descripcion: "" },
    { nombre: "Flan", precio: "?", descripcion: "" },
    { nombre: "Tres leches", precio: "?", descripcion: "" },
    { nombre: "Helados caseros", precio: "?", descripcion: "" }
  ]
};

/* ---------------- TRADUCCIÓN ---------------- */
async function traducir(texto) {
  if (!texto) return "";
  try {
    const res = await fetch(
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" +
      encodeURIComponent(texto)
    );
    const data = await res.json();
    return data[0][0][0];
  } catch {
    return "";
  }
}

/* ---------------- AUTO AJUSTE ---------------- */
function comprimirMenuParaUnaSolaHoja() {
  const alturaMax = 760;
  const minFontSize = 12.5;
  let fontSize = 16;

  menuDiv.style.fontSize = fontSize + "px";

  while (menuDiv.scrollHeight > alturaMax && fontSize > minFontSize) {
    fontSize -= 0.3;
    menuDiv.style.fontSize = fontSize + "px";
  }
}

/* ---------------- FORM ---------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const platillo = {
    nombre: nombreInput.value,
    precio: precioInput.value,
    descripcion: descripcionInput.value,
    color: colorInput.value,
    traduccion: await traducir(descripcionInput.value)
  };

  if (editIndex !== null) {
    menu[editIndex] = platillo;
    editIndex = null;
    cancelarBtn.hidden = true;
  } else {
    menu.push(platillo);
  }

  guardar();
  form.reset();
  colorInput.value = "#ffffff";
});

/* ---------------- RENDER MENU ---------------- */
function renderMenu() {
  menuDiv.innerHTML = "";

  menu.forEach((p, index) => {

    //  ESPACIO EN BLANCO
  if (p.tipo === "espacio") {
    const div = document.createElement("div");
    div.className = "item espacio";

    div.innerHTML = `
      <div class="actions no-print">
        <button onclick="mover(${index},-1)">⬆️</button>
        <button onclick="mover(${index},1)">⬇️</button>
        <button onclick="eliminarPlatillo(${index})">Eliminar</button>
      </div>
    `;

    menuDiv.appendChild(div);
    return;
  }

  
    const div = document.createElement("div");
    div.className = "item";
    div.style.color = p.color;

    if (!p.precio) div.classList.add("es-titulo");

    div.innerHTML = `
      <strong>${p.nombre} ${p.precio ? "— ₡" + p.precio : ""}</strong>
      <p>${p.descripcion}</p>
      ${p.traduccion ? `<small>EN: ${p.traduccion}</small>` : ""}
      <div class="actions no-print">
        <button onclick="mover(${index},-1)">⬆️</button>
        <button onclick="mover(${index},1)">⬇️</button>
        <button onclick="editarPlatillo(${index})">Editar</button>
        <button onclick="eliminarPlatillo(${index})">Eliminar</button>
      </div>
    `;
    menuDiv.appendChild(div);
  });

  setTimeout(comprimirMenuParaUnaSolaHoja, 80);
}

/* ---------------- PREDEFINIDOS (IGUAL) ---------------- */
function renderPredefinidos() {
  predefDiv.innerHTML = "";

  for (const categoria in predefinidos) {
    const catDiv = document.createElement("div");
    catDiv.className = "category-title";
    catDiv.innerText = categoria;
    predefDiv.appendChild(catDiv);

    predefinidos[categoria].forEach((p) => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <strong>${p.nombre}</strong>
        <button class="no-print">＋ Añadir</button>
      `;
      div.querySelector("button").onclick = async () => {
        const traduccion = await traducir(p.descripcion);
        menu.push({ ...p, color: "#ffffff", traduccion });
        guardar();
      };
      predefDiv.appendChild(div);
    });
  }
}

function mover(i, d) {
  const j = i + d;
  if (j < 0 || j >= menu.length) return;
  [menu[i], menu[j]] = [menu[j], menu[i]];
  guardar();
}

function editarPlatillo(i) {
  const p = menu[i];
  nombreInput.value = p.nombre;
  precioInput.value = p.precio;
  descripcionInput.value = p.descripcion;
  colorInput.value = p.color || "#000000";
  editIndex = i;
  cancelarBtn.hidden = false;
  window.scrollTo(0, 0);
}

function eliminarPlatillo(i) {
  menu.splice(i, 1);
  guardar();
}

function guardar() {
  localStorage.setItem("menu", JSON.stringify(menu));
  renderMenu();
}

fontSelect.addEventListener("change", () => {
  menuDiv.style.fontFamily = fontSelect.value;
  setTimeout(comprimirMenuParaUnaSolaHoja, 80);
});

cancelarBtn.onclick = () => {
  editIndex = null;
  form.reset();
  cancelarBtn.hidden = true;
};

lineDownBtn.addEventListener("click", () => {
  menu.push({
    tipo: "espacio"
  });
  guardar();
});

/* INIT */
renderMenu();
renderPredefinidos();
