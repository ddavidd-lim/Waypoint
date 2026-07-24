import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { supabase } from '@/services/supabase';
import { removeAutofillBackgroundSx } from '@/styles/removeAutofillBackgroundSx';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';



const signupSchema = z.object(
  {
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string("Passwords don't match"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  }
  );

  const onSubmit = handleSubmit(
    async (formData) => {
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.log('Error signing up:', error);
        setSubmitError("An account with this email already exists or there was an error creating the account. Please try again.");
        return;
      }
      setSubmitError(null);

      enqueueSnackbar('Account created successfully!', { variant: 'success', autoHideDuration: 5000 });

      navigate('/');
    },
    (errors) => {
      console.log('Validation errors:', errors);
    }
  );

  const handlePasswordVisible = () => {
    setPasswordVisible(prev => !prev);
  }

  return (
    <Box sx={{
      width: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Paper component={'form'} onSubmit={onSubmit} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Stack direction={'column'} spacing={2}>
          <Stack>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Sign up
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'text.secondary' }} >
              Create a new account
            </Typography>
          </Stack>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Email'
                variant='outlined'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}

                sx={removeAutofillBackgroundSx}

                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    )
                  }
                }} />
            )} />

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Password'
                variant='outlined'
                type={passwordVisible ? '' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}

                sx={removeAutofillBackgroundSx}

                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePasswordVisible}>
                          {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }

                }} />
            )} />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Confirm Password'
                variant='outlined'
                type={passwordVisible ? '' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}

                sx={removeAutofillBackgroundSx}

                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePasswordVisible}>
                          {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }

                }} />
            )} />

          {submitError && (
            <Typography color="error" variant="body2">
              {submitError}
            </Typography>
          )}

          <Button variant='contained' color='primary' type='submit' disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
          </Button>

          <Box>
            <Typography>
              Already have an account? <Link component={RouterLink} to={'/login'}>Login</Link>
            </Typography>
          </Box>
          <Box>
            <Typography>
              <Link component={RouterLink} to={'/'}>Skip for now</Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}