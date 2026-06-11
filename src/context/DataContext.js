import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { subscribeToAllData, seedDatabase, isSeeded, clearDatabase } from "../firebase/firestoreService";
import { generateFinancialData } from "../data/sampleData";
import { generateTCSRealData } from "../data/tcsRealData";

const DataContext = createContext();

// Merge real TCS data into the generated dataset
const buildSeedRecords = () => {
  const generated = generateFinancialData().filter(d => d.company !== "TCS");
  const tcsReal   = generateTCSRealData();
  return [...tcsReal, ...generated];
};

export const DataProvider = ({ children }) => {
  const [allData, setAllData]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [seeding, setSeeding]   = useState(false);
  const [error,   setError]     = useState(null);
  const [lastSync,setLastSync]  = useState(null);

  const getCompanyData = useCallback((company) =>
    allData.filter(d => d.company === company)
           .sort((a, b) => a.quarterIndex - b.quarterIndex),
  [allData]);

  const getQuarterData = useCallback((quarter) =>
    allData.filter(d => d.quarter === quarter),
  [allData]);

  const getFilteredData = useCallback((companies, quarter) =>
    allData.filter(d =>
      (!companies || companies.length === 0 || companies.includes(d.company)) &&
      (!quarter   || quarter === "All"       || d.quarter === quarter)
    ),
  [allData]);

  const getGrowthData = useCallback((company) => {
    const cd = allData
      .filter(d => d.company === company)
      .sort((a, b) => a.quarterIndex - b.quarterIndex);
    return cd.map((d, i) => {
      const prev    = i > 0 ? cd[i-1] : null;
      const yoyPrev = i >= 4 ? cd[i-4] : null;
      return {
        ...d,
        qoqRevenue:    prev    ? parseFloat(((d.revenue    - prev.revenue)    / prev.revenue    * 100).toFixed(2)) : null,
        yoyRevenue:    yoyPrev ? parseFloat(((d.revenue    - yoyPrev.revenue) / yoyPrev.revenue * 100).toFixed(2)) : null,
        qoqRevenueUSD: prev    ? parseFloat(((d.revenueUSD - prev.revenueUSD) / prev.revenueUSD * 100).toFixed(2)) : null,
        yoyRevenueUSD: yoyPrev ? parseFloat(((d.revenueUSD - yoyPrev.revenueUSD) / yoyPrev.revenueUSD * 100).toFixed(2)) : null,
        qoqMargin:     prev    ? parseFloat((d.operatingMargin - prev.operatingMargin).toFixed(2)) : null,
      };
    });
  }, [allData]);

  // Reseed helper (also callable from DataUpload page)
  const reseed = useCallback(async () => {
    setSeeding(true);
    try {
      await clearDatabase();
      await seedDatabase(buildSeedRecords());
    } finally {
      setSeeding(false);
    }
  }, []);

  useEffect(() => {
    let unsub;
    const init = async () => {
      try {
        const seededAlready = await isSeeded();
        if (!seededAlready) {
          setSeeding(true);
          await seedDatabase(buildSeedRecords());
          setSeeding(false);
        }
        unsub = subscribeToAllData((data) => {
          setAllData(data);
          setLastSync(new Date());
          setLoading(false);
        });
      } catch (err) {
        console.error("Firestore init error:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    init();
    return () => unsub && unsub();
  }, []);

  return (
    <DataContext.Provider value={{
      allData, loading, seeding, error, lastSync, reseed,
      getCompanyData, getQuarterData, getFilteredData, getGrowthData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
