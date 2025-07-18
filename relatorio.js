// Gerar gráfico de horas por prefixo
async function gerarGraficos() {
  const snapshot = await db.collection("registros").get();
  const dados = {};

  snapshot.forEach(doc => {
    const r = doc.data();
    if (!dados[r.prefixo]) dados[r.prefixo] = 0;
    dados[r.prefixo] += r.horas;
  });

  const labels = Object.keys(dados);
  const valores = Object.values(dados);

  const graficoContainer = document.createElement("div");
  graficoContainer.style.width = "100%";
  graficoContainer.innerHTML = `<canvas id="graficoHoras"></canvas>`;
  document.body.appendChild(graficoContainer);

  new Chart(document.getElementById("graficoHoras"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Horas Trabalhadas por Prefixo",
        data: valores,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    }
  });
}

// Gerar relatório PDF mensal
async function gerarRelatorioMensal() {
  const agora = new Date();
  const mesAtual = agora.toISOString().slice(0, 7); // yyyy-mm

  const snapshot = await db.collection("registros").get();

  let html = `<h2>Relatório Mensal - ${mesAtual}</h2>`;
  html += `<table border="1" style="width:100%; border-collapse:collapse;">
    <thead>
      <tr>
        <th>Data</th>
        <th>Prefixo</th>
        <th>Turno</th>
        <th>Início</th>
        <th>Fim</th>
        <th>Horas</th>
        <th>Obs</th>
      </tr>
    </thead><tbody>`;

  let totalHoras = 0;

  snapshot.forEach(doc => {
    const r = doc.data();
    if (r.data && r.data.startsWith(mesAtual)) {
      html += `
        <tr>
          <td>${r.data}</td>
          <td>${r.prefixo}</td>
          <td>${r.turno}</td>
          <td>${r.inicio}</td>
          <td>${r.fim}</td>
          <td>${r.horas}</td>
          <td>${r.obs || ""}</td>
        </tr>
      `;
      totalHoras += r.horas;
    }
  });

  html += `</tbody></table>`;
  html += `<p><strong>Total de horas no mês:</strong> ${totalHoras}</p>`;

  const opt = {
    margin:       0.5,
    filename:     `relatorio_${mesAtual}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(html).set(opt).save();
}
