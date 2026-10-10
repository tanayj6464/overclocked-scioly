// Tables and bar charts that some questions need.
export default function QuestionVisual({ table, chart }) {
  if (table) {
    return (
      <div className="table-scroll q-visual">
        <table className="q-table">
          <caption>{table.caption}</caption>
          <thead>
            <tr>{table.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (chart) {
    const W = 520, H = 260, padL = 44, padB = 34, padT = 30, padR = 12;
    const max = Math.ceil(Math.max(...chart.values) / 10) * 10;
    const plotH = H - padB - padT;
    const slot = (W - padL - padR) / chart.values.length;
    const bw = slot * 0.56;
    const y = (v) => padT + plotH - (v / max) * plotH;
    const ticks = Array.from({ length: max / 10 + 1 }, (_, i) => i * 10);
    const label = `${chart.title}: ${chart.labels.map((l, i) => `${l} ${chart.values[i]}`).join(", ")}`;
    return (
      <figure className="q-visual q-chart">
        <figcaption>{chart.title}</figcaption>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#e2d9ce" />
              <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#59636a">{t}</text>
            </g>
          ))}
          {chart.values.map((v, i) => {
            const x = padL + i * slot + (slot - bw) / 2;
            return (
              <g key={i}>
                <rect x={x} y={y(v)} width={bw} height={padT + plotH - y(v)} fill="#246084" />
                <text x={x + bw / 2} y={y(v) - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d2327">{v}</text>
                <text x={x + bw / 2} y={H - 12} textAnchor="middle" fontSize="13" fill="#1d2327">{chart.labels[i]}</text>
              </g>
            );
          })}
        </svg>
      </figure>
    );
  }
  return null;
}
