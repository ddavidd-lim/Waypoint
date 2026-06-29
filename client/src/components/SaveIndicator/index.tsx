import Box from "@mui/material/Box";
import type { SaveState } from "./types";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

type Props = {
  state: SaveState;
  enableText?: boolean;
  updatedAt: string;
}
export function SaveIndicator({ state, enableText, updatedAt }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {state === 'saving' && <CircularProgress size={16} />}
      {state === 'saved' && (
        <Fade in>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: 'success.main' }} />
        </Fade>
      )}
      {enableText && (
        <Tooltip title={`Last updated: ${updatedAt}`} placement="top" arrow>
          <Typography variant="caption" color="text.secondary">
            {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
}