import Box from "@mui/material/Box";
import type { SaveState } from "./types";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Typography from "@mui/material/Typography";


export function SaveIndicator({ state, enableText }: { state: SaveState, enableText?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {state === 'saving' && <CircularProgress size={16} />}
      {state === 'saved' && (
        <Fade in>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: 'success.main' }} />
        </Fade>
      )}
      {enableText && (
        <Typography variant="caption" color="text.secondary">
          {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}
        </Typography>
      )}
    </Box>
  );
}