const db = firebase.firestore();
const form = document.getElementById("registroForm");
const tabela = document.querySelector("#tabela tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = document.getElementById("data").value;
  const prefixo = document.getElementById("prefixo").value;
  const turno = document.getElementById("turno").value;
  const inicio = parseFloat(document.getElementById("inicio").value);
  const fim = parseFloat(document.getElementById("fim").value);
  const obs = document.getElementById("obs").value;

  if (fim < inicio) {
    alert("Horímetro final não pode ser menor que o inicial.");
    return;
  }

  const horas = fim - inicio;

  await db.collection("registros").add({
    data,
    prefixo,
    turno,
    inicio,
    fim,
    horas,
    obs,
    criadoEm: new Date(),
  });

  form.reset();
  carregarRegistros();
});

// 🔄 Carrega todos os registros
async function carregarRegistros(filtros = {}) {
  let query = db.collection("registros").orderBy("data", "desc");

  const snapshot = await query.get();
  tabela.innerHTML = "";

  snapshot.forEach((doc) => {
    const r = doc.data();

    if (
      (filtros.data && r.data !== filtros.data) ||
      (filtros.prefixo && !r.prefixo.includes(filtros.prefixo)) ||
      (filtros.turno && r.turno !== filtros.turno)
    ) {
      return; // pula se não bate com filtro
    }

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.data}</td>
      <td>${r.prefixo}</td>
      <td>${r.turno}</td>
      <td>${r.inicio}</td>
      <td>${r.fim}</td>
      <td>${r.horas}</td>
      <td>${r.obs || ""}</td>
      <td>
        <button onclick="deletarRegistro('${doc.id}')">🗑️</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}

async function deletarRegistro(id) {
  if (confirm("Deseja excluir este registro?")) {
    await db.collection("registros").doc(id).delete();
    carregarRegistros();
  }
}

function filtrarRegistros() {
  const data = document.getElementById("filtroData").value;
  const prefixo = document.getElementById("filtroPrefixo").value;
  const turno = document.getElementById("filtroTurno").value;

  carregarRegistros({ data, prefixo, turno });
}

function limparFiltros() {
  document.getElementById("filtroData").value = "";
  document.getElementById("filtroPrefixo").value = "";
  document.getElementById("filtroTurno").value = "";
  carregarRegistros();
}

function exportarExcel() {
  const rows = [["Data", "Prefixo", "Turno", "Início", "Fim", "Horas", "Observação"]];

  tabela.querySelectorAll("tr").forEach((row) => {
    const cols = [...row.querySelectorAll("td")].map((td) => td.textContent);
    if (cols.length > 0) rows.push(cols);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "ParteDiaria");
  XLSX.writeFile(wb, "parte_diaria.xlsx");
}

window.onload = () => carregarRegistros();
