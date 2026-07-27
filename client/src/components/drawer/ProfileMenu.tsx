import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';


type LoggedInProfileItemsProps = {
  handleProfileMenuClose: () => void;
  handleLogout: () => void;
};

function LoggedInProfileItems({ handleProfileMenuClose, handleLogout }: LoggedInProfileItemsProps) {
  return (
    <>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </>
  );
}

type LoggedOutProfileItemsProps = {
  handleSignIn: () => void;
};

function LoggedOutProfileItems({ handleSignIn }: LoggedOutProfileItemsProps) {
  return (
    <MenuItem onClick={handleSignIn} sx={{ color: 'primary.main' }}>
      <ListItemIcon>
        <LoginIcon fontSize="small" color="primary" />
      </ListItemIcon>
      Sign up
    </MenuItem>
  );
}

type Props = {
  anchorEl: HTMLElement | null;
  handleProfileMenuClose: () => void;
  handleLogout: () => void;
}

export default function ProfleMenu({ anchorEl, handleProfileMenuClose, handleLogout }: Props) {
  const navigate = useNavigate();
  const { data: user } = useUser();

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoFocus={false}
      slotProps={{
        list: {
          sx: {
            py: 0,
          },
        },
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}>
      {user?.is_anonymous ? (
        <LoggedOutProfileItems handleSignIn={() => navigate('/signup')} />
      ) : (
        <LoggedInProfileItems handleLogout={handleLogout} handleProfileMenuClose={handleProfileMenuClose} />
      )}
    </Menu>
  )
}