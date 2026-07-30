import { RIGHT_DRAWER_WIDTH } from '@/constants.ts/drawerWidth';
import { useDraggablePlaces } from '@/hooks/useDraggablePlaces';
import { usePlaces } from '@/hooks/usePlace';
import type { Place } from '@/types/places';
import type { LocationPin } from "@/types/location-pin";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import Box from "@mui/material/Box";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { OverviewMap } from '../OverviewMap';
import { PlaceReorder } from './PlaceReorder';


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'fullScreen',
})<{ fullScreen?: boolean }>(({ fullScreen }) => ({
  width: fullScreen ? '100%' : RIGHT_DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: fullScreen ? '100%' : RIGHT_DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
}));

const EMPTY: Place[] = [];

type Props = {
  handleDrawerClose: () => void;
  open: boolean;
  pins: LocationPin[];
}
export default function OverviewMapDrawer({ handleDrawerClose, open, pins }: Props) {
  const theme = useTheme();

  const { data: pois = EMPTY } = usePlaces(pins);

  const { orderedPlaces, activeOrderedPlaces, excluded, setOrder, toggle } = useDraggablePlaces(pois);

  const [showRoute, setShowRoute] = useState(false);

  const [autoPanEnabled, setAutoPanEnabled] = useState(true);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      elevation={0}
      ModalProps={{
        keepMounted: true
      }}
      fullScreen={isMobile}
      sx={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          justifyContent: 'start'
        }}
      >
        <IconButton variant='noteMenu' onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
        </IconButton>
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Overview Map
          </Typography>
        </Box>
      </Stack>
      <FormGroup
        row
        sx={{
          px: 2,
          py: 0.5,
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showRoute}
              onChange={(e) => setShowRoute(e.target.checked)}
              disabled={activeOrderedPlaces.length < 2}
            />
          }
          label="Show route"
          slotProps={{ typography: { variant: 'body2' } }}
          sx={{ m: 0, gap: 0.5 }}
        />

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={autoPanEnabled}
              onChange={(e) => setAutoPanEnabled(e.target.checked)}
            />
          }
          label="Auto pan"
          slotProps={{ typography: { variant: 'body2' } }}
          sx={{ m: 0, gap: 0.5 }}
        />
      </FormGroup>
      <OverviewMap places={activeOrderedPlaces} allPlaces={orderedPlaces} showRoute={showRoute} autoPanEnabled={autoPanEnabled} />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <PlaceReorder
          items={orderedPlaces}
          onOrderChange={setOrder}
          excluded={excluded}
          onToggle={toggle}
        />
      </Box>
    </Drawer>
  );
}