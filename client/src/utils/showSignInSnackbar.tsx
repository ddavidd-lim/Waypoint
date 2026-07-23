import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar, closeSnackbar, type SnackbarKey } from "notistack";
import { router } from "@/routers";

export function showSignInSnackbar(): SnackbarKey {
  const key = enqueueSnackbar("Sign in to save your notes", {
    persist: true,
    action: (id) => (
      <Stack direction="row" spacing={1}>
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            router.navigate('/signup')
            closeSnackbar(id);
          }}
        >
          Sign In
        </Button>
        <IconButton size="small" onClick={() => closeSnackbar(id)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  });

  return key;
}