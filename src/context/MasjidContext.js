'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MASJIDS_DATA, DEFAULT_MASJID_ID } from '@/constants/masjidsData';

const MasjidContext = createContext();

export function MasjidProvider({ children }) {
  const [selectedMasjidId, setSelectedMasjidId] = useState(DEFAULT_MASJID_ID);

  // Hydrate selected masjid from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('selected_masjid_id');
    if (saved && MASJIDS_DATA[saved]) {
      setSelectedMasjidId(saved);
    }
  }, []);

  const changeMasjid = (id) => {
    if (MASJIDS_DATA[id]) {
      setSelectedMasjidId(id);
      localStorage.setItem('selected_masjid_id', id);
    }
  };

  const currentMasjid = MASJIDS_DATA[selectedMasjidId] || MASJIDS_DATA[DEFAULT_MASJID_ID];

  return (
    <MasjidContext.Provider
      value={{
        currentMasjid,
        selectedMasjidId,
        changeMasjid,
        allMasjids: Object.values(MASJIDS_DATA),
      }}
    >
      {children}
    </MasjidContext.Provider>
  );
}

export function useMasjid() {
  const context = useContext(MasjidContext);
  if (!context) {
    throw new Error('useMasjid must be used within a MasjidProvider');
  }
  return context;
}