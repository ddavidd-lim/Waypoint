import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import type { SaveState } from "./types";

type Props = {
  state: SaveState;
  enableText?: boolean;
  updatedAt: string;
};
export function SaveIndicator({ state, updatedAt }: Props) {
  return (
    <Tooltip title={`Last updated: ${updatedAt}`} placement="top" arrow enterDelay={500} leaveDelay={200}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {state === 'saving' && <CircularProgress size={16} />}
        {state === 'saved' || state === 'idle' && (
          <Fade in>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: 'success.main' }} />
          </Fade>
        )}
      </Box>
    </Tooltip>
  );
}