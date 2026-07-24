import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { useAuth } from '../auth/useAuth'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <Container maxW="2xl" py={{ base: 12, md: 20 }}>
      <Stack gap={6}>
        <Heading size="2xl">PantryPal</Heading>
        <Text color="fg.muted">
          Signed in as {user?.email || 'your account'}. Recipe matching is coming next —
          this is the authenticated home for now.
        </Text>
        <Button variant="outline" alignSelf="flex-start" onClick={logout}>
          Log out
        </Button>
      </Stack>
    </Container>
  )
}
