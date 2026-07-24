import { Button, Field, Input, Stack } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../lib/api'
import { AuthShell, FormError } from '../components/AuthShell'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: () => navigate('/', { replace: true }),
  })

  const error = mutation.error
  const fieldErrors = error instanceof ApiError ? error.fieldErrors : {}
  const generalError =
    error && !(error instanceof ApiError && Object.keys(error.fieldErrors).length > 0)
      ? (error as Error).message
      : null

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see what you can cook tonight"
      footer={<>No account? <RouterLink to="/register">Create one</RouterLink></>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <Stack gap={4}>
          {generalError && <FormError message={generalError} />}
          <Field.Root required invalid={!!fieldErrors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Field.ErrorText>{fieldErrors.email}</Field.ErrorText>
          </Field.Root>
          <Field.Root required invalid={!!fieldErrors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Field.ErrorText>{fieldErrors.password}</Field.ErrorText>
          </Field.Root>
          <Button type="submit" loading={mutation.isPending} width="full">
            Log in
          </Button>
        </Stack>
      </form>
    </AuthShell>
  )
}
