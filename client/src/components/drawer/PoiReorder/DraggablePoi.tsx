import type { Poi } from '@/types/places';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Checkbox, Chip, Paper, Stack, Typography } from '@mui/material';
import { Reorder, useDragControls } from 'framer-motion';

type Props = {
  poi: Poi;
  included: boolean;
  index?: number;
  onToggle: (key: string) => void;
  onCommit: () => void;
}

export function DraggablePoi({ poi, included, index, onToggle, onCommit }: Props) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={poi}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
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

          <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>

            <Chip label={index ?? '~'} sx={{
              bgcolor: included ? '#e81a1a' : 'transparent',
              fontSize: 12,
              fontWeight: 600,
            }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap>{poi.name}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {poi.city}, {poi.state}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Reorder.Item>
  );
}

