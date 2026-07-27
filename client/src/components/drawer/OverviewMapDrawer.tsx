import { RIGHT_DRAWER_WIDTH } from '@/constants.ts/drawerWidth';
import { useOrderedPois } from '@/hooks/useOrderedPois';
import { usePlacePois } from '@/hooks/usePlacePois';
import type { Place } from '@/types/places';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from "@mui/material/Box";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';
import { OverviewMap } from '../OverviewMap';
import { PoiReorderList } from './PoiRow';


const Drawer = styled(MuiDrawer)({
  width: RIGHT_DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: RIGHT_DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
});


type Props = {
  handleDrawerClose: () => void;
  open: boolean;
  places: Place[];
}
export default function OverviewMapDrawer({ handleDrawerClose, open, places }: Props) {
  const theme = useTheme();

  const { data: pois = [] } = usePlacePois(places);
  const { items, order, setOrder } = useOrderedPois(pois);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const handleToggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

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
        <Box>
          <IconButton variant='noteMenu' onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
          </IconButton>
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Overview Map
          </Typography>
        </Box>
      </Stack>

      <OverviewMap pois={items} />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <PoiReorderList
          pois={pois}
          order={order}
          onOrderChange={setOrder}
          selected={selected}
          onToggle={handleToggle}
        />
      </Box>
    </Drawer>
  );
}