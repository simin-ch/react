import createCache from '@emotion/cache';
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LoadingWidget } from "components/Core/LoadingWidget/LoadingWidget";
import { NutritionCard } from "components/Dashboard/NutritionCard";
import { RoutineCard } from "components/Dashboard/RoutineCard";
import { WeightCard } from "components/Dashboard/WeightCard";
import { IngredientSearch } from "components/Nutrition/components/IngredientSearch";
import { NutritionPrecisionProvider } from "components/Nutrition/context/NutritionPrecisionContext";
import React, { Suspense } from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import { WgerRoutes } from "routes";
import { makeTheme, theme } from 'theme';

import App from './App';
import './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';


const queryClient = new QueryClient({
    // -> https://tanstack.com/query/latest/docs/reference/QueryClient
    // time in milliseconds, so 1000 * 30 = 30s

    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: 1000 * 60 * 5,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: "always"
        },
    }
});


const renderComponentShadowDom = (divId: string) => {

    const rootElement = document.getElementById(divId);
    if (rootElement === null) {
        return;
    }

    const shadow = rootElement.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    const styleElement = document.createElement('style');

    const djangoReactStyle = document.getElementById('react-css');
    if (djangoReactStyle) {
        const djangoStyleElement = document.createElement('link');
        djangoStyleElement.setAttribute('rel', 'stylesheet');
        // @ts-ignore
        djangoStyleElement.setAttribute('href', djangoReactStyle.href);
        shadow.appendChild(djangoReactStyle);
    }

    shadow.appendChild(shadowRoot);
    shadow.appendChild(styleElement);


    const cache = createCache({
        key: 'css',
        prepend: true,
        container: styleElement,
    });

    const root = createRoot(shadowRoot);
    root.render(
        <CacheProvider value={cache}>
            <Suspense fallback={<LoadingWidget />}>
                <Router>
                    <ThemeProvider theme={makeTheme(shadowRoot)}>
                        <QueryClientProvider client={queryClient}>
                            <NutritionPrecisionProvider>
                                <WgerRoutes />
                            </NutritionPrecisionProvider>
                        </QueryClientProvider>
                    </ThemeProvider>
                </Router>
            </Suspense>
        </CacheProvider>
    );
};

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Suspense fallback={<LoadingWidget />}>
                <Router>
                    <ThemeProvider theme={theme}>
                        <QueryClientProvider client={queryClient}>
                            <NutritionPrecisionProvider>
                                <App />
                                <ReactQueryDevtools />
                            </NutritionPrecisionProvider>
                        </QueryClientProvider>
                    </ThemeProvider>
                </Router>
            </Suspense>
        </React.StrictMode>
    );
}


const rootNoShadowDom = document.getElementById("react-page-no-shadow-dom");
if (rootNoShadowDom) {
    const root = createRoot(rootNoShadowDom);
    root.render(
        <Suspense fallback={<LoadingWidget />}>
            <Router>
                <ThemeProvider theme={theme}>
                    <QueryClientProvider client={queryClient}>
                        <NutritionPrecisionProvider>
                            <WgerRoutes />
                        </NutritionPrecisionProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </Router>
        </Suspense>
    );
}

renderComponentShadowDom('react-page');

/*
 * Components used in the wger django app, don't change the IDs here
 */
const weightDashboard = document.getElementById("react-weight-dashboard");
if (weightDashboard) {
    const root = createRoot(weightDashboard);
    root.render(
        <Suspense fallback={<LoadingWidget />}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <WeightCard />
                </QueryClientProvider>
            </ThemeProvider>
        </Suspense>
    );
}

const nutritionDashboard = document.getElementById('react-nutrition-dashboard');
if (nutritionDashboard) {
    const root = createRoot(nutritionDashboard);
    root.render(
        <Suspense fallback={<LoadingWidget />}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <NutritionPrecisionProvider>
                        <NutritionCard />
                    </NutritionPrecisionProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </Suspense>
    );
}

const routineDashboard = document.getElementById('react-routine-dashboard');
if (routineDashboard) {
    const root = createRoot(routineDashboard);
    root.render(
        <Suspense fallback={<LoadingWidget />}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <RoutineCard />
                </QueryClientProvider>
            </ThemeProvider>
        </Suspense>
    );
}


const ingredientSearchBox = document.getElementById("react-ingredient-search");
if (ingredientSearchBox) {
    const root = createRoot(ingredientSearchBox);
    root.render(
        <Suspense fallback={<LoadingWidget />}>
            <ThemeProvider theme={theme}>
                <NutritionPrecisionProvider>
                    <IngredientSearch />
                </NutritionPrecisionProvider>
            </ThemeProvider>
        </Suspense>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
