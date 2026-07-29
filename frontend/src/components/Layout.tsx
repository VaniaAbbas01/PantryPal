import { Box, Button, Container, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isPantryActive = location.pathname === '/' || location.pathname === '/pantry'
  const isRecipesActive = location.pathname.startsWith('/recipes')

  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box borderBottomWidth="1px" bg="bg.panel" py={3} px={{ base: 4, md: 8 }} boxShadow="xs">
        <Container maxW="5xl">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack gap={6} align="center">
              <Text fontWeight="extrabold" fontSize="xl" letterSpacing="tight">
                🍳 PantryPal
              </Text>
              <HStack gap={2}>
                <Button
                  asChild
                  variant={isPantryActive ? 'solid' : 'ghost'}
                  size="sm"
                >
                  <RouterLink to="/">My Pantry</RouterLink>
                </Button>
                <Button
                  asChild
                  variant={isRecipesActive ? 'solid' : 'ghost'}
                  size="sm"
                >
                  <RouterLink to="/recipes">Find Recipes</RouterLink>
                </Button>
              </HStack>
            </HStack>

            <HStack gap={4} align="center">
              {user?.email && (
                <Text fontSize="sm" color="fg.muted" display={{ base: 'none', sm: 'block' }}>
                  {user.email}
                </Text>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Box py={{ base: 6, md: 10 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
