import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function Login() {

  useEffect(() => {
    const key = enqueueSnackbar("Sign in to save your notes", {
      persist: true,
      action: (id) => (
        <Stack direction={'row'} spacing={1}>
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              // handleSignIn();
              closeSnackbar(id);
            }}
          >
            Sign In
          </Button>
          <IconButton size='small' onClick={() => closeSnackbar(id)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    });

    return () => {
      closeSnackbar(key);
    };
  }, []);

  return (
    <Stack>
      <h1>Login</h1>
    </Stack>
  )
}