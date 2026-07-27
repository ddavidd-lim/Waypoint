import type { Poi } from '@/types/places';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Checkbox, Paper, Stack, Typography } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';
import { useMemo } from 'react';


function PoiRow({
  poi,
  checked,
  onToggle,
}: {
  poi: Poi;
  checked: boolean;
  onToggle: (key: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={poi} dragListener={false} dragControls={controls} as="li" style={{ listStyle: 'none' }}>
      <Paper variant="outlined" sx={{ mb: 1 }}>
        <Stack direction="row" sx={{ pr: 1, py: 0.5, alignItems: 'center' }}>
          <Box
            onPointerDown={(e) => controls.start(e)}
            sx={{ display: 'flex', alignItems: 'center', px: 1, alignSelf: 'stretch', cursor: 'grab', touchAction: 'none' }}
          >
            <DragIndicatorIcon fontSize="small" color="disabled" />
          </Box>

          <Checkbox checked={checked} onChange={() => onToggle(poi.key)} />

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
  pois,
  selected,
  onToggle,
  order,
  onOrderChange,
}: {
  pois: Poi[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  order: string[] | null;
  onOrderChange: (ids: string[]) => void;
}) {
  const items = useMemo(() => {
    if (!order) return pois;
    const byKey = new Map(pois.map((p) => [p.key, p]));
    const ordered = order.flatMap((k) => byKey.get(k) ?? []);
    const seen = new Set(order);
    return [...ordered, ...pois.filter((p) => !seen.has(p.key))];
  }, [pois, order]);

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
          checked={selected.has(poi.key)}
          onToggle={onToggle}
        />
      ))}
    </Reorder.Group>
  );
}