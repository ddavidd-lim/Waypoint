import type { Poi } from '@/types/places';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Checkbox, Paper, Stack, Typography } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';

function PoiRow({
  poi,
  included,
  onToggle,
}: {
  poi: Poi;
  included: boolean;
  onToggle: (key: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={poi}
      dragListener={false}
      dragControls={controls}
      as="li"
      style={{ listStyle: 'none' }}
    >
      <Paper
        variant="outlined"
        sx={{ mb: 1, opacity: included ? 1 : 0.55 }}
      >
        <Stack direction="row" sx={{ pr: 1, py: 0.5, alignItems: 'center' }}>
          <Box
            onPointerDown={(e) => controls.start(e)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1,
              alignSelf: 'stretch',
              cursor: 'grab',
              touchAction: 'none',
              '&:active': { cursor: 'grabbing' },
            }}
          >
            <DragIndicatorIcon fontSize="small" color="disabled" />
          </Box>

          <Checkbox checked={included} onChange={() => onToggle(poi.key)} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap>{poi.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {poi.city}, {poi.state}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Reorder.Item>
  );
}

export function PoiReorderList({
  items,
  excluded,
  onToggle,
  onOrderChange,
}: {
  items: Poi[];
  excluded: Set<string>;
  onToggle: (key: string) => void;
  onOrderChange: (keys: string[]) => void;
}) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(next) => onOrderChange(next.map((p) => p.key))}
      as="ul"
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map((poi) => (
        <PoiRow
          key={poi.key}
          poi={poi}
          included={!excluded.has(poi.key)}
          onToggle={onToggle}
        />
      ))}
    </Reorder.Group>
  );
}