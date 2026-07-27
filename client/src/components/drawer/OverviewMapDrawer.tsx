import { RIGHT_DRAWER_WIDTH } from '@/constants.ts/drawerWidth';
import { useOrderedPois } from '@/hooks/useOrderedPois';
import { usePlacePois } from '@/hooks/usePlacePois';
import type { Place, Poi } from '@/types/places';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from "@mui/material/Box";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useMemo, useState } from 'react';
import { OverviewMap } from '../OverviewMap';
import { PoiReorderList } from './PoiRow';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';


const Drawer = styled(MuiDrawer)({
  width: RIGHT_DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: RIGHT_DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
});

const EMPTY: Poi[] = [];

type Props = {
  handleDrawerClose: () => void;
  open: boolean;
  places: Place[];
}
export default function OverviewMapDrawer({ handleDrawerClose, open, places }: Props) {
  const theme = useTheme();

  const { data: pois = EMPTY } = usePlacePois(places);
  const { items, setOrder } = useOrderedPois(pois);

  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());

  const [showRoute, setShowRoute] = useState(true);

  const [autoPanEnabled, setAutoPanEnabled] = useState(true);

  const handleToggle = useCallback((id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const activePois = useMemo(
    () => items.filter((p) => !excluded.has(p.key)),
    [items, excluded]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
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
              disabled={activePois.length < 2}
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
      <OverviewMap pois={activePois} allPois={items} showRoute={showRoute} autoPanEnabled={autoPanEnabled} />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <PoiReorderList
          items={items}
          onOrderChange={setOrder}
          excluded={excluded}
          onToggle={handleToggle}
        />
      </Box>
    </Drawer>
  );
}