import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const uploadHistory = [
  { id: 1, filename: 'IT_Companies_Q4FY25.xlsx', date: '2025-04-02 09:14', records: 7, status: 'success', size: '248 KB' },
  { id: 2, filename: 'IT_Companies_Q3FY25.xlsx', date: '2025-01-06 11:30', records: 7, status: 'success', size: '241 KB' },
  { id: 3, filename: 'IT_Companies_Q2FY25_v2.xlsx', date: '2024-10-14 14:22', records: 7, status: 'success', size: '239 KB' },
  { id: 4, filename: 'IT_Companies_Q2FY25.xlsx', date: '2024-10-11 10:05', records: 7, status: 'error', size: '211 KB', error: 'Missing columns: attrition, netAdditions' },
];

const syncLogs = [
  { time: '2025-04-02 06:00', status: 'success', msg: 'Auto-sync: 7 company records updated for Q4FY25' },
  { time: '2025-03-26 06:00', status: 'success', msg: 'Auto-sync: No new data detected' },
  { time: '2025-03-19 06:00', status: 'warning', msg: 'Auto-sync: File not found at C:\\FinancialData\\IT_Companies.xlsx' },
];

export default function DataUpload() {
  const { darkMode } = useTheme();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [tab, setTab] = useState('upload');
  const [syncPath, setSyncPath] = useState('C:\\FinancialData\\IT_Companies.xlsx');
  const [schedule, setSchedule] = useState('daily');

  const inputStyle = { background: darkMode ? '#1a2235' : '#fff', border: `1px solid ${darkMode ? '#253451' : '#cbd5e1'}`, color: darkMode ? '#e8edf5' : '#0f172a', borderRadius: 6, padding: '8px 12px', fontSize: 13, width: '100%', fontFamily: 'Inter', outline: 'none' };
  const btnStyle = (primary) => ({ padding: '9px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', background: primary ? '#3b82f6' : 'var(--bg-card)', color: primary ? '#fff' : 'var(--text-secondary)', border: primary ? 'none' : '1px solid var(--border)' });
  const tabStyle = (active) => ({ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', background: active ? 'var(--accent-glow)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent' });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) simulateUpload(file.name);
  };

  const simulateUpload = (name) => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploadDone(true); }, 2200);
  };

  const excelCols = [
    { sheet: 'Company Info', columns: 'Quarter, Company' },
    { sheet: 'Financials', columns: 'Quarter, Revenue, EBIT, EBITDA, PAT, EPS, Operating Margin, Net Margin, Cash Flow' },
    { sheet: 'Employees', columns: 'Quarter, Total Employees, Net Additions, Attrition %' },
    { sheet: 'Clients', columns: 'Quarter, Total Clients, $1M Clients, $5M Clients, $10M Clients, Large Deals' },
    { sheet: 'Geography', columns: 'Quarter, NA Revenue, Europe Revenue, India Revenue, APAC Revenue' },
    { sheet: 'Verticals', columns: 'Quarter, BFSI, Retail, Manufacturing, Healthcare, Telecom, Energy Revenue' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Data Management</div>
          <div className="page-subtitle">Upload Excel files or configure automated sync</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {[['upload','📤 Excel Upload'], ['sync','🔄 Local File Sync'], ['schema','📋 Excel Schema'], ['logs','📜 Audit Logs']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={tabStyle(tab === id)}>{label}</button>
        ))}
      </div>

      {tab === 'upload' && (
        <div>
          <div
            className={`upload-zone ${dragOver ? 'active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input id="fileInput" type="file" accept=".xlsx,.xls" onChange={handleFileInput} style={{ display: 'none' }} />
            {uploading ? (
              <div>
                <div className="spinner" />
                <div style={{ color: 'var(--accent)', fontWeight: 600, marginTop: 8 }}>Parsing Excel file...</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>Validating columns and detecting quarters</div>
              </div>
            ) : uploadDone ? (
              <div>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <div style={{ color: 'var(--positive)', fontWeight: 600, fontSize: 16 }}>Upload Successful!</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>7 company records updated · Q4FY25 data loaded</div>
                <button onClick={e => { e.stopPropagation(); setUploadDone(false); }} style={{ ...btnStyle(false), marginTop: 12 }}>Upload Another</button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>Drop your Excel file here</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>or click to browse · Supports .xlsx and .xls</div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['Multi-sheet support', 'Auto quarter detection', 'Duplicate prevention', 'Validation errors'].map(f => (
                    <span key={f} style={{ padding: '3px 10px', borderRadius: 12, background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="chart-card" style={{ marginTop: 20 }}>
            <div className="chart-header"><div className="chart-title">Upload History</div></div>
            <table className="data-table">
              <thead><tr><th>#</th><th>Filename</th><th>Uploaded</th><th>Records</th><th>Size</th><th>Status</th></tr></thead>
              <tbody>
                {uploadHistory.map(h => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td style={{ fontFamily: 'Inter', color: 'var(--text-primary)' }}>{h.filename}</td>
                    <td>{h.date}</td>
                    <td>{h.records} companies</td>
                    <td>{h.size}</td>
                    <td>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'Inter', fontWeight: 600, background: h.status === 'success' ? 'var(--positive-bg)' : 'var(--negative-bg)', color: h.status === 'success' ? 'var(--positive)' : 'var(--negative)' }}>
                        {h.status === 'success' ? '✓ Success' : '✗ Error'}
                      </span>
                      {h.error && <div style={{ fontSize: 11, color: 'var(--negative)', marginTop: 2 }}>{h.error}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sync' && (
        <div>
          <div className="chart-card" style={{ marginBottom: 20 }}>
            <div className="chart-title" style={{ marginBottom: 16 }}>Local File Sync Configuration</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Excel File Path</label>
                <input value={syncPath} onChange={e => setSyncPath(e.target.value)} style={inputStyle} placeholder="C:\FinancialData\IT_Companies.xlsx" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Sync Schedule</label>
                <select value={schedule} onChange={e => setSchedule(e.target.value)} style={inputStyle}>
                  <option value="daily">Daily (06:00 AM)</option>
                  <option value="weekly">Weekly (Monday 06:00 AM)</option>
                  <option value="monthly">Monthly (1st, 06:00 AM)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button style={btnStyle(true)}>💾 Save Configuration</button>
              <button style={btnStyle(false)}>▶ Run Sync Now</button>
              <button style={btnStyle(false)}>🧪 Test Connection</button>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header"><div className="chart-title">API Endpoint Reference</div></div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 6, padding: 16, fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#f59e0b' }}>POST</span> <span style={{ color: 'var(--accent)' }}>/api/sync-excel</span></div>
              <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 11 }}>// Reads file from configured path, parses all sheets,</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>// detects new quarters, upserts records, logs activity</div>
              <div style={{ marginTop: 8 }}><span style={{ color: '#10b981' }}>Response:</span> {'{'} status, recordsUpdated, newQuarters, errors {'}'}</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'schema' && (
        <div>
          <div className="chart-card" style={{ marginBottom: 16 }}>
            <div className="chart-title" style={{ marginBottom: 12 }}>Expected Excel Structure</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The Excel file should contain multiple sheets — one per data category. New metrics can be added as new columns without code changes (metadata-driven architecture).
            </div>
          </div>
          {excelCols.map((s, i) => (
            <div key={i} className="chart-card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>📄 Sheet: {s.sheet}</div>
                <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>Required</span>
              </div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 6, padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)' }}>
                {s.columns}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Sync & Import Activity Log</div></div>
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>Status</th><th>Activity</th></tr></thead>
            <tbody>
              {syncLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.time}</td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'Inter', fontWeight: 600, background: log.status === 'success' ? 'var(--positive-bg)' : log.status === 'warning' ? 'var(--warning-bg)' : 'var(--negative-bg)', color: log.status === 'success' ? 'var(--positive)' : log.status === 'warning' ? 'var(--warning)' : 'var(--negative)' }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>{log.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
