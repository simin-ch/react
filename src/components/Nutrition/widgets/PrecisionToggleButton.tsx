import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useNutritionPrecision } from "../context/NutritionPrecisionContext";

export const PrecisionToggleButton = () => {
    const { precision, togglePrecision } = useNutritionPrecision();
    
    return (
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
    );
};
