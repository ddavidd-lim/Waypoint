import { RAIL_WIDTH } from '@/constants.ts/drawerWidth';
import { Box, IconButton } from '@mui/material';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MapIcon from '@mui/icons-material/Map';


type Props = {
  openRightDrawer: boolean;
  handleRightDrawerOpen: () => void;
  handleRightDrawerClose: () => void;
};

export default function RightRail({ openRightDrawer, handleRightDrawerOpen, handleRightDrawerClose }: Props) {

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: RAIL_WIDTH,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 1,
        gap: 0.5,
      }}
    >
      <IconButton variant='noteMenu' onClick={openRightDrawer ? handleRightDrawerClose : handleRightDrawerOpen}>
        {openRightDrawer ? <KeyboardDoubleArrowRightIcon /> : <MapIcon />}
      </IconButton>
    </Box >
  );
}