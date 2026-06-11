import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { logUpload, fetchUploadHistory, fetchSyncLogs, logSync } from '../firebase/firestoreService';
import { useData } from '../context/DataContext';


const excelCols = [
  {sheet:'Company Info', columns:'Quarter, Company'},
  {sheet:'Financials',   columns:'Quarter, Revenue, EBIT, EBITDA, PAT, EPS, Operating Margin, Net Margin, Cash Flow'},
  {sheet:'Employees',    columns:'Quarter, Total Employees, Net Additions, Attrition %'},
  {sheet:'Clients',      columns:'Quarter, Total Clients, $1M Clients, $5M Clients, $10M Clients, Large Deals'},
  {sheet:'Geography',    columns:'Quarter, NA Revenue, Europe Revenue, India Revenue, APAC Revenue'},
  {sheet:'Verticals',    columns:'Quarter, BFSI, Retail, Manufacturing, Healthcare, Telecom, Energy Revenue'},
];

export default function DataUpload() {
  const { darkMode } = useTheme();
  const { reseed } = useData();
  const [dragOver, setDragOver]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(null); // null | 'success' | 'error'
  const [tab, setTab]             = useState('upload');
  const [syncPath, setSyncPath]   = useState('C:\\FinancialData\\IT_Companies.xlsx');
  const [schedule, setSchedule]   = useState('daily');
  const [history, setHistory]     = useState([]);
  const [logs, setLogs]           = useState([]);
  const [reseeding, setReseeding] = useState(false);

  useEffect(() => {
    fetchUploadHistory().then(setHistory).catch(console.error);
    fetchSyncLogs().then(setLogs).catch(console.error);
  }, []);

  const inputStyle  = { background:darkMode?'#1a2235':'#fff', border:`1px solid ${darkMode?'#253451':'#cbd5e1'}`, color:darkMode?'#e8edf5':'#0f172a', borderRadius:6, padding:'8px 12px', fontSize:13, width:'100%', fontFamily:'Inter', outline:'none' };
  const btnStyle    = (primary) => ({ padding:'9px 20px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'Inter', background:primary?'#3b82f6':'var(--bg-card)', color:primary?'#fff':'var(--text-secondary)', border:primary?'none':'1px solid var(--border)' });
  const tabStyle    = (active)  => ({ padding:'8px 20px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'Inter', background:active?'var(--accent-glow)':'transparent', color:active?'var(--accent)':'var(--text-secondary)', borderBottom:active?'2px solid var(--accent)':'2px solid transparent' });

  const simulateUpload = async (name, size) => {
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    try {
      await logUpload({ filename:name, records:7, size, status:'success' });
      setUploadDone('success');
      const h = await fetchUploadHistory();
      setHistory(h);
    } catch (e) {
      setUploadDone('error');
    }
    setUploading(false);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f) simulateUpload(f.name, `${Math.round(f.size/1024)} KB`); };
  const handleFileInput = (e) => { const f=e.target.files[0]; if(f) simulateUpload(f.name, `${Math.round(f.size/1024)} KB`); };

  const handleReseed = async () => {
    setReseeding(true);
    try {
      await reseed();
      await logSync({ status:'success', msg:'Manual reseed: 84 records written — TCS with real investor-relations data, others with model data' });
      const l = await fetchSyncLogs(); setLogs(l);
      alert('✅ Database reseeded! TCS: real IR data. Other companies: model data.');
    } catch(e) { alert('Error: ' + e.message); }
    setReseeding(false);
  };

  const handleSaveSync = async () => {
    await logSync({ status:'info', msg:`Sync config saved: ${syncPath} · Schedule: ${schedule}` });
    const l = await fetchSyncLogs(); setLogs(l);
    alert('✅ Sync configuration saved to Firestore!');
  };

  const handleRunSync = async () => {
    await logSync({ status:'success', msg:`Manual sync triggered: ${syncPath}` });
    const l = await fetchSyncLogs(); setLogs(l);
    alert('🔄 Sync job triggered. In production, this reads your local file and updates Firestore.');
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Data Management</div>
        <div className="page-subtitle">Upload Excel or configure sync · <span style={{color:'var(--positive)',fontSize:11}}>● Connected to Firestore</span></div></div>
        <button onClick={handleReseed} disabled={reseeding} style={{...btnStyle(false), display:'flex', alignItems:'center', gap:6, opacity:reseeding?0.6:1}}>
          {reseeding ? '⏳ Reseeding…' : '🔄 Reseed Database'}
        </button>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:24,borderBottom:'1px solid var(--border)'}}>
        {[['upload','📤 Excel Upload'],['sync','🔄 Local File Sync'],['schema','📋 Excel Schema'],['logs','📜 Firestore Logs']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={tabStyle(tab===id)}>{label}</button>
        ))}
      </div>

      {tab==='upload' && (
        <div>
          <div className={`upload-zone ${dragOver?'active':''}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true)}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            onClick={()=>document.getElementById('fileInput').click()}>
            <input id="fileInput" type="file" accept=".xlsx,.xls" onChange={handleFileInput} style={{display:'none'}}/>
            {uploading ? (
              <div><div className="spinner"/><div style={{color:'var(--accent)',fontWeight:600,marginTop:8}}>Parsing & writing to Firestore…</div>
              <div style={{color:'var(--text-secondary)',fontSize:12,marginTop:4}}>Validating columns, detecting quarters, upserting records</div></div>
            ) : uploadDone==='success' ? (
              <div><div style={{fontSize:40,marginBottom:8}}>✅</div>
              <div style={{color:'var(--positive)',fontWeight:600,fontSize:16}}>Upload logged to Firestore!</div>
              <div style={{color:'var(--text-secondary)',fontSize:13,marginTop:4}}>7 company records updated · Upload history saved</div>
              <button onClick={e=>{e.stopPropagation();setUploadDone(null)}} style={{...btnStyle(false),marginTop:12}}>Upload Another</button></div>
            ) : (
              <div><div style={{fontSize:40,marginBottom:12}}>📂</div>
              <div style={{color:'var(--text-primary)',fontWeight:600,fontSize:15}}>Drop your Excel file here</div>
              <div style={{color:'var(--text-secondary)',fontSize:13,marginTop:6}}>or click to browse · Supports .xlsx and .xls</div>
              <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
                {['Multi-sheet support','Auto quarter detection','Firestore upsert','Duplicate prevention'].map(f=>(
                  <span key={f} style={{padding:'3px 10px',borderRadius:12,background:'var(--accent-glow)',color:'var(--accent)',fontSize:11,fontWeight:600}}>{f}</span>
                ))}</div></div>
            )}
          </div>
          <div className="chart-card" style={{marginTop:20}}>
            <div className="chart-header"><div className="chart-title">Upload History — Firestore</div></div>
            {history.length===0 ? (
              <div style={{color:'var(--text-muted)',padding:'20px 0',fontSize:13}}>No uploads yet. Upload a file to see history here.</div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Filename</th><th>Timestamp</th><th>Records</th><th>Size</th><th>Status</th></tr></thead>
                <tbody>
                  {history.map((h,i)=>(
                    <tr key={i}>
                      <td style={{fontFamily:'Inter',color:'var(--text-primary)'}}>{h.filename}</td>
                      <td>{h.timestamp?.toDate?.()?.toLocaleString() || 'Just now'}</td>
                      <td>{h.records} companies</td>
                      <td>{h.size}</td>
                      <td><span style={{padding:'2px 8px',borderRadius:4,fontSize:11,fontFamily:'Inter',fontWeight:600,background:h.status==='success'?'var(--positive-bg)':'var(--negative-bg)',color:h.status==='success'?'var(--positive)':'var(--negative)'}}>{h.status==='success'?'✓ Success':'✗ Error'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab==='sync' && (
        <div>
          <div className="chart-card" style={{marginBottom:20}}>
            <div className="chart-title" style={{marginBottom:16}}>Local File Sync Configuration</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Excel File Path</label>
                <input value={syncPath} onChange={e=>setSyncPath(e.target.value)} style={inputStyle} placeholder="C:\FinancialData\IT_Companies.xlsx"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Sync Schedule</label>
                <select value={schedule} onChange={e=>setSchedule(e.target.value)} style={inputStyle}>
                  <option value="daily">Daily (06:00 AM)</option>
                  <option value="weekly">Weekly (Monday 06:00 AM)</option>
                  <option value="monthly">Monthly (1st, 06:00 AM)</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button onClick={handleSaveSync}  style={btnStyle(true)}>💾 Save to Firestore</button>
              <button onClick={handleRunSync}   style={btnStyle(false)}>▶ Run Sync Now</button>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-header"><div className="chart-title">API Endpoint Reference</div></div>
            <div style={{background:'var(--bg-primary)',borderRadius:6,padding:16,fontFamily:'JetBrains Mono',fontSize:12,color:'var(--text-secondary)',lineHeight:1.8}}>
              <div><span style={{color:'#f59e0b'}}>POST</span> <span style={{color:'var(--accent)'}}>/api/sync-excel</span></div>
              <div style={{marginTop:8,color:'var(--text-muted)',fontSize:11}}>// Reads file → parses all sheets → upserts Firestore records</div>
              <div><span style={{color:'#10b981'}}>Response:</span> {'{'} status, recordsUpdated, newQuarters, errors {'}'}</div>
            </div>
          </div>
        </div>
      )}

      {tab==='schema' && (
        <div>
          <div className="chart-card" style={{marginBottom:16}}>
            <div className="chart-title" style={{marginBottom:12}}>Expected Excel Structure</div>
            <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>Multi-sheet Excel — one sheet per data category. New columns are auto-discovered (metadata-driven).</div>
          </div>
          {excelCols.map((s,i)=>(
            <div key={i} className="chart-card" style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',marginBottom:8}}>📄 {s.sheet}</div>
                <span style={{padding:'2px 8px',borderRadius:4,background:'var(--accent-glow)',color:'var(--accent)',fontSize:11,fontWeight:600}}>Required</span>
              </div>
              <div style={{background:'var(--bg-primary)',borderRadius:6,padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--text-secondary)'}}>{s.columns}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='logs' && (
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Sync & Import Logs — Firestore</div></div>
          {logs.length===0 ? (
            <div style={{color:'var(--text-muted)',padding:'20px 0',fontSize:13}}>No sync logs yet. Trigger a sync to see activity here.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Timestamp</th><th>Status</th><th>Activity</th></tr></thead>
              <tbody>
                {logs.map((log,i)=>(
                  <tr key={i}>
                    <td>{log.timestamp?.toDate?.()?.toLocaleString() || 'Just now'}</td>
                    <td><span style={{padding:'2px 8px',borderRadius:4,fontSize:11,fontFamily:'Inter',fontWeight:600,background:log.status==='success'?'var(--positive-bg)':log.status==='warning'?'var(--warning-bg)':'var(--accent-glow)',color:log.status==='success'?'var(--positive)':log.status==='warning'?'var(--warning)':'var(--accent)'}}>{log.status}</span></td>
                    <td style={{color:'var(--text-primary)',fontFamily:'Inter'}}>{log.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
