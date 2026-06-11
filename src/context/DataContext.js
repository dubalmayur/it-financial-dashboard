import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { subscribeToAllData, seedDatabase, isSeeded } from "../firebase/firestoreService";
import { generateFinancialData } from "../data/sampleData";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [allData, setAllData]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [seeding, setSeeding]     = useState(false);
  const [error, setError]         = useState(null);
  const [lastSync, setLastSync]   = useState(null);

  // Derived helpers (computed from live allData)
  const getCompanyData = useCallback((company) =>
    allData
      .filter(d => d.company === company)
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
      const prev    = i > 0 ? cd[i - 1] : null;
      const yoyPrev = i >= 4 ? cd[i - 4] : null;
      return {
        ...d,
        qoqRevenue: prev
          ? parseFloat(((d.revenue - prev.revenue) / prev.revenue * 100).toFixed(2))
          : null,
        yoyRevenue: yoyPrev
          ? parseFloat(((d.revenue - yoyPrev.revenue) / yoyPrev.revenue * 100).toFixed(2))
          : null,
        qoqMargin: prev
          ? parseFloat((d.operatingMargin - prev.operatingMargin).toFixed(2))
          : null,
      };
    });
  }, [allData]);

  // ── Seed Firestore on first launch ────────────────────────────────────────
  useEffect(() => {
    let unsubscribe;
    const init = async () => {
      try {
        // Check if already seeded
        const seededAlready = await isSeeded();
        if (!seededAlready) {
          setSeeding(true);
          const records = generateFinancialData();
          await seedDatabase(records);
          setSeeding(false);
        }
        // Subscribe to real-time updates
        unsubscribe = subscribeToAllData((data) => {
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
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <DataContext.Provider value={{
      allData, loading, seeding, error, lastSync,
      getCompanyData, getQuarterData, getFilteredData, getGrowthData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
