import {
  collection, doc, setDoc, getDoc, getDocs,
  query, where, writeBatch, serverTimestamp,
  onSnapshot, addDoc
} from "firebase/firestore";
import { db } from "./config";

const FINANCIAL_DATA = "financialData";
const UPLOAD_HISTORY = "uploadHistory";
const SYNC_LOGS      = "syncLogs";

const docId = (company, quarter) =>
  `${company.replace(/\s+/g, "_")}_${quarter}`;

export const upsertRecord = async (record) => {
  const ref = doc(db, FINANCIAL_DATA, docId(record.company, record.quarter));
  await setDoc(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
};

export const seedDatabase = async (records) => {
  const chunkSize = 450;
  for (let i = 0; i < records.length; i += chunkSize) {
    const batch = writeBatch(db);
    records.slice(i, i + chunkSize).forEach(record => {
      const ref = doc(db, FINANCIAL_DATA, docId(record.company, record.quarter));
      batch.set(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
  }
};

export const isSeeded = async () => {
  const snap = await getDocs(collection(db, FINANCIAL_DATA));
  return snap.size > 0;
};

export const fetchAllData = async () => {
  const snap = await getDocs(collection(db, FINANCIAL_DATA));
  return snap.docs.map(d => d.data());
};

export const subscribeToAllData = (callback) => {
  return onSnapshot(collection(db, FINANCIAL_DATA), snap => {
    callback(snap.docs.map(d => d.data()));
  });
};

export const clearDatabase = async () => {
  const snap = await getDocs(collection(db, FINANCIAL_DATA));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};

export const logUpload = async (entry) => {
  await addDoc(collection(db, UPLOAD_HISTORY), { ...entry, timestamp: serverTimestamp() });
};
export const fetchUploadHistory = async () => {
  const snap = await getDocs(collection(db, UPLOAD_HISTORY));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
};
export const logSync = async (entry) => {
  await addDoc(collection(db, SYNC_LOGS), { ...entry, timestamp: serverTimestamp() });
};
export const fetchSyncLogs = async () => {
  const snap = await getDocs(collection(db, SYNC_LOGS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
};
