import { Button, Field, Input, Stack } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../lib/api'
import { AuthShell, FormError } from '../components/AuthShell'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      register({ email, password, displayName: displayName || undefined }),
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
      title="Create your account"
      subtitle="Start cooking with what you already have"
      footer={<>Already have an account? <RouterLink to="/login">Log in</RouterLink></>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <Stack gap={4}>
          {generalError && <FormError message={generalError} />}
          <Field.Root>
            <Field.Label>Display name</Field.Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </Field.Root>
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
              autoComplete="new-password"
            />
            <Field.HelperText>At least 8 characters.</Field.HelperText>
            <Field.ErrorText>{fieldErrors.password}</Field.ErrorText>
          </Field.Root>
          <Button type="submit" loading={mutation.isPending} width="full">
            Create account
          </Button>
        </Stack>
      </form>
    </AuthShell>
  )
}
