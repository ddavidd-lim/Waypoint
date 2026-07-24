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
import { useQueryClient } from '@tanstack/react-query';


const loginSchema = z.object(
  {
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
  }
)

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handlePasswordVisible = () => {
    setPasswordVisible(prev => !prev);
  }

  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },

  }
  );

  const onSubmit = handleSubmit(
    async (formData) => {
      const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });

      if (error) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError(null);

      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      navigate('/');
    },
    (errors) => {
      console.log('Validation errors:', errors);
    }
  )

  return (
    <Box sx={{
      width: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Paper component={'form'} onSubmit={onSubmit} sx={{ p: 4 }}>
        <Stack direction={'column'} spacing={2}>
          <Stack>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Login
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'text.secondary' }} >
              Sign-in to an existing account
            </Typography>
          </Stack>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label='Email' variant='outlined'
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
              <TextField {...field} label='Password' variant='outlined' type={passwordVisible ? 'text' : 'password'}
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

          <Button type='submit' sx={{ backgroundColor: 'green' }} disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Logging in' : 'Login'}
          </Button>
          <Box>
            <Typography>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
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