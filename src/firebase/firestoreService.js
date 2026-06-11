import {
  collection, doc, setDoc, getDoc, getDocs,
  query, where, orderBy, writeBatch, serverTimestamp,
  onSnapshot, deleteDoc, addDoc
} from "firebase/firestore";
import { db } from "./config";

// ── Collection names ────────────────────────────────────────────────────────
const FINANCIAL_DATA = "financialData";
const UPLOAD_HISTORY = "uploadHistory";
const SYNC_LOGS      = "syncLogs";

// ── Document ID helper ──────────────────────────────────────────────────────
const docId = (company, quarter) =>
  `${company.replace(/\s+/g, "_")}_${quarter}`;

// ── Write a single quarter record ───────────────────────────────────────────
export const upsertRecord = async (record) => {
  const id = docId(record.company, record.quarter);
  const ref = doc(db, FINANCIAL_DATA, id);
  await setDoc(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
};

// ── Bulk seed — uses batched writes (max 500 per batch) ────────────────────
export const seedDatabase = async (records) => {
  const chunkSize = 450;
  for (let i = 0; i < records.length; i += chunkSize) {
    const batch = writeBatch(db);
    records.slice(i, i + chunkSize).forEach(record => {
      const id  = docId(record.company, record.quarter);
      const ref = doc(db, FINANCIAL_DATA, id);
      batch.set(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
  }
};

// ── Check if DB already has data (skip re-seeding) ─────────────────────────
export const isSeeded = async () => {
  const snap = await getDocs(query(collection(db, FINANCIAL_DATA), orderBy("quarter"), ));
  return snap.size > 0;
};

// ── Fetch all records ───────────────────────────────────────────────────────
export const fetchAllData = async () => {
  const snap = await getDocs(collection(db, FINANCIAL_DATA));
  return snap.docs.map(d => d.data());
};

// ── Real-time listener for all data ────────────────────────────────────────
export const subscribeToAllData = (callback) => {
  const q = collection(db, FINANCIAL_DATA);
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => d.data());
    callback(data);
  });
};

// ── Fetch by company ────────────────────────────────────────────────────────
export const fetchCompanyData = async (company) => {
  const q = query(
    collection(db, FINANCIAL_DATA),
    where("company", "==", company)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => d.data())
    .sort((a, b) => a.quarterIndex - b.quarterIndex);
};

// ── Fetch by quarter ────────────────────────────────────────────────────────
export const fetchQuarterData = async (quarter) => {
  const q = query(
    collection(db, FINANCIAL_DATA),
    where("quarter", "==", quarter)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
};

// ── Delete all records (for re-seeding) ────────────────────────────────────
export const clearDatabase = async () => {
  const snap = await getDocs(collection(db, FINANCIAL_DATA));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};

// ── Upload history ──────────────────────────────────────────────────────────
export const logUpload = async (entry) => {
  await addDoc(collection(db, UPLOAD_HISTORY), {
    ...entry,
    timestamp: serverTimestamp()
  });
};

export const fetchUploadHistory = async () => {
  const snap = await getDocs(collection(db, UPLOAD_HISTORY));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
};

// ── Sync logs ───────────────────────────────────────────────────────────────
export const logSync = async (entry) => {
  await addDoc(collection(db, SYNC_LOGS), {
    ...entry,
    timestamp: serverTimestamp()
  });
};

export const fetchSyncLogs = async () => {
  const snap = await getDocs(collection(db, SYNC_LOGS));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
};
