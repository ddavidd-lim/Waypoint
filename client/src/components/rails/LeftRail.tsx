import { RAIL_WIDTH } from '@/constants.ts/drawerWidth';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Box, IconButton } from '@mui/material';


type Props = {
  openLeftDrawer: boolean;
  handleLeftDrawerOpen: () => void;
  handleLeftDrawerClose: () => void;
};

export default function LeftRail({ openLeftDrawer, handleLeftDrawerOpen, handleLeftDrawerClose }: Props) {

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: RAIL_WIDTH,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 1,
        gap: 0.5,
      }}
    >
      <IconButton variant='noteMenu' onClick={openLeftDrawer ? handleLeftDrawerClose : handleLeftDrawerOpen}>
        {openLeftDrawer ? <KeyboardDoubleArrowLeftIcon /> : <FolderIcon />}
      </IconButton>
    </Box >
  );
}