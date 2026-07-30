import { LEFT_DRAWER_WIDTH, RAIL_WIDTH, RIGHT_DRAWER_WIDTH } from '@/constants.ts/drawerWidth';
import { styled } from '@mui/material/styles';


export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'openLeft' && prop !== 'openRight'
})<{
  openLeft?: boolean;
  openRight?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${LEFT_DRAWER_WIDTH}px`,
  marginRight: `-${RIGHT_DRAWER_WIDTH}px`,
  paddingRight: `${RAIL_WIDTH}px`,
  paddingLeft: `${RAIL_WIDTH}px`,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  variants: [
    {
      props: ({ openLeft }) => openLeft,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
    {
      props: ({ openRight }) => openRight,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      },
    },
  ],
}));