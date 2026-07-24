import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <Container maxW="md" py={{ base: 12, md: 24 }}>
      <Stack gap={8}>
        <Stack gap={2} textAlign="center">
          <Heading size="2xl">{title}</Heading>
          <Text color="fg.muted">{subtitle}</Text>
        </Stack>
        <Box borderWidth="1px" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="sm">
          {children}
        </Box>
        <Text textAlign="center" color="fg.muted">
          {footer}
        </Text>
      </Stack>
    </Container>
  )
}

/** Top-level (non-field) error banner. */
export function FormError({ message }: { message: string }) {
  return (
    <Box
      role="alert"
      bg="red.subtle"
      color="red.fg"
      borderRadius="md"
      px={4}
      py={3}
      fontSize="sm"
    >
      {message}
    </Box>
  )
}
