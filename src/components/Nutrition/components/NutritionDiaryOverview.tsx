import { Stack, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { LoadingPlaceholder } from "components/Core/LoadingWidget/LoadingWidget";
import { WgerContainerRightSidebar } from "components/Core/Widgets/Container";
import { useFetchNutritionalPlanDateQuery } from "components/Nutrition/queries";
import { IngredientDetailTable } from "components/Nutrition/widgets/IngredientDetailTable";
import { LoggedPlannedNutritionalValuesTable } from "components/Nutrition/widgets/LoggedPlannedNutritionalValuesTable";
import { useNutritionPrecision } from "../context/NutritionPrecisionContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";


export const NutritionDiaryOverview = () => {
    const [t] = useTranslation();
    const params = useParams<{ planId: string, date: string }>();

    const planId = parseInt(params.planId!);
    if (Number.isNaN(planId)) {
        return <p>Please pass an integer as the nutritional plan id.</p>;
    }

    const date = new Date(params.date!);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const planQuery = useFetchNutritionalPlanDateQuery(planId, params.date!);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { precision, togglePrecision } = useNutritionPrecision();

    return planQuery.isLoading
        ? <LoadingPlaceholder />
        : <WgerContainerRightSidebar
            title={t('nutrition.nutritionalDiary')}
            mainContent={<>
                <Stack spacing={2}>
                    {/* Date with precision toggle */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography gutterBottom variant="h4">
                            {date.toLocaleDateString()}
                        </Typography>
                               <Box display="flex" alignItems="center" gap={1}>
                                   <Typography variant="body2" color="text.secondary">
                                       {precision === 0 ? "Whole numbers" : "One decimal"}
                                   </Typography>
                                   <Tooltip title={precision === 0 ? "Show one decimal places" : "Show whole numbers"}>
                                       <IconButton onClick={togglePrecision} size="small">
                                           {precision === 0 ? <ToggleOff /> : <ToggleOn />}
                                       </IconButton>
                                   </Tooltip>
                               </Box>
                    </Box>
                    
                    <LoggedPlannedNutritionalValuesTable
                        logged={planQuery.data!.loggedNutritionalValuesDate(date)}
                        planned={planQuery.data!.plannedNutritionalValues}
                    />
                    <IngredientDetailTable
                        values={planQuery.data!.loggedNutritionalValuesDate(date)}
                        items={planQuery.data!.loggedEntriesDate(date)}
                        showSum={true} />

                </Stack>
            </>}
        />;
};