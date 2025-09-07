import React, { createContext, useContext, useState, useEffect } from 'react';

interface NutritionPrecisionContextType {
    precision: number;
    togglePrecision: () => void;
}

const NutritionPrecisionContext = createContext<NutritionPrecisionContextType | null>(null);

const PRECISION_STORAGE_KEY = 'nutrition-precision';

export const NutritionPrecisionProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize precision from localStorage or default to 0 (no decimal places)
    const [precision, setPrecision] = useState(() => {
        const stored = localStorage.getItem(PRECISION_STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    });

    const togglePrecision = () => {
        const newPrecision = precision === 0 ? 1 : 0;
        setPrecision(newPrecision);
        localStorage.setItem(PRECISION_STORAGE_KEY, newPrecision.toString());
    };

    // Listen for localStorage changes from other windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === PRECISION_STORAGE_KEY && e.newValue) {
                setPrecision(parseInt(e.newValue, 10));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <NutritionPrecisionContext.Provider value={{ precision, togglePrecision }}>
            {children}
        </NutritionPrecisionContext.Provider>
    );
};

export const useNutritionPrecision = () => {
    const context = useContext(NutritionPrecisionContext);
    if (!context) {
        throw new Error('useNutritionPrecision must be used within a NutritionPrecisionProvider');
    }
    return context;
};
