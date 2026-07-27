import type { Theme } from "@mui/material/styles";

export const removeAutofillBackgroundSx = {
  '& input:-webkit-autofill': {
    WebkitBoxShadow: (theme: Theme) =>
      `0 0 0 30px ${theme.palette.background.paper} inset`,
    WebkitTextFillColor: (theme: Theme) => theme.palette.text.primary,
    caretColor: (theme: Theme) => theme.palette.text.primary,
    transition: 'background-color 5000s ease-in-out 0s',
  },
};