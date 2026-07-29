import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FormError } from '../components/AuthShell'
import { recipeApi } from '../lib/api'
import type { RecipeMatch, RecipeDetail } from '../lib/api'

const RECIPES_QUERY_KEY = ['recipes', 'match'] as const

function MatchBadge({ matchPercentage, canMake }: { matchPercentage: number; canMake: boolean }) {
  if (canMake) {
    return (
      <Badge colorPalette="green" variant="solid" size="lg" px={3} py={1} borderRadius="full">
        ✨ 100% Ready to Cook
      </Badge>
    )
  }
  if (matchPercentage >= 50) {
    return (
      <Badge colorPalette="orange" variant="subtle" size="md" px={2.5} py={0.5} borderRadius="full">
        {matchPercentage}% Match
      </Badge>
    )
  }
  return (
    <Badge colorPalette="gray" variant="subtle" size="md" px={2.5} py={0.5} borderRadius="full">
      {matchPercentage}% Match
    </Badge>
  )
}

function RecipeDetailModal({
  recipeId,
  onClose,
}: {
  recipeId: number
  onClose: () => void
}) {
  const detailQuery = useQuery<RecipeDetail>({
    queryKey: ['recipe', recipeId],
    queryFn: () => recipeApi.getDetail(recipeId),
  })

  const recipe = detailQuery.data

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.700"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="bg.panel"
        borderRadius="2xl"
        maxW="2xl"
        w="full"
        maxH="90vh"
        overflowY="auto"
        p={{ base: 6, md: 8 }}
        boxShadow="2xl"
        position="relative"
      >
        {detailQuery.isLoading && <Text color="fg.muted">Loading recipe details…</Text>}
        {detailQuery.isError && (
          <FormError message={(detailQuery.error as Error).message} />
        )}
        {recipe && (
          <Stack gap={6}>
            <HStack justify="space-between" align="flex-start">
              <Stack gap={1}>
                <HStack gap={2} flexWrap="wrap">
                  <MatchBadge matchPercentage={recipe.matchPercentage} canMake={recipe.canMake} />
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </HStack>
                <Heading size="xl" mt={1}>{recipe.title}</Heading>
                <Text color="fg.muted">{recipe.description}</Text>
              </Stack>
              <Button size="sm" variant="ghost" onClick={onClose}>
                ✕ Close
              </Button>
            </HStack>

            <HStack gap={6} p={4} bg="bg.subtle" borderRadius="xl" flexWrap="wrap">
              <Stack gap={0}>
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">Prep Time</Text>
                <Text fontWeight="semibold">⏱️ {recipe.prepTimeMinutes} mins</Text>
              </Stack>
              <Stack gap={0}>
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">Cook Time</Text>
                <Text fontWeight="semibold">🍳 {recipe.cookTimeMinutes} mins</Text>
              </Stack>
              <Stack gap={0}>
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">Servings</Text>
                <Text fontWeight="semibold">🍽️ {recipe.servings} {recipe.servings === 1 ? 'person' : 'people'}</Text>
              </Stack>
            </HStack>

            <Stack gap={3}>
              <Heading size="md">Ingredients Checklist</Heading>
              <Stack gap={2}>
                {recipe.ingredients.map((ing) => (
                  <HStack
                    key={ing.id}
                    justify="space-between"
                    p={3}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={ing.isAvailable ? 'green.200' : 'border.subtle'}
                    bg={ing.isAvailable ? 'green.50/30' : 'bg.panel'}
                  >
                    <HStack gap={3}>
                      <Text fontSize="lg">{ing.isAvailable ? '✅' : '❌'}</Text>
                      <Stack gap={0}>
                        <Text fontWeight={ing.isAvailable ? 'semibold' : 'normal'}>
                          {ing.name} {ing.isOptional && '(Optional)'}
                        </Text>
                        {(ing.quantity != null || ing.unit) && (
                          <Text fontSize="xs" color="fg.muted">
                            {ing.quantity} {ing.unit}
                          </Text>
                        )}
                      </Stack>
                    </HStack>
                    <Badge colorPalette={ing.isAvailable ? 'green' : 'red'} variant="subtle" size="sm">
                      {ing.isAvailable ? 'In Pantry' : 'Missing'}
                    </Badge>
                  </HStack>
                ))}
              </Stack>
            </Stack>

            <Stack gap={3}>
              <Heading size="md">Instructions</Heading>
              <Box p={4} bg="bg.subtle" borderRadius="xl" whiteSpace="pre-line" lineHeight="relaxed">
                {recipe.instructions}
              </Box>
            </Stack>

            <HStack justify="flex-end">
              <Button onClick={onClose}>Done</Button>
            </HStack>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export function RecipesPage() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyCanMake, setOnlyCanMake] = useState(false)

  const recipesQuery = useQuery<RecipeMatch[]>({
    queryKey: RECIPES_QUERY_KEY,
    queryFn: recipeApi.findMatching,
  })

  const recipes = recipesQuery.data ?? []

  const filteredRecipes = recipes.filter((r) => {
    if (onlyCanMake && !r.canMake) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.matchedIngredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    return true
  })

  const readyToCookCount = recipes.filter((r) => r.canMake).length

  return (
    <Container maxW="4xl">
      <Stack gap={8}>
        <Stack gap={2}>
          <Heading size="2xl">Recipe Matcher 🍳</Heading>
          <Text color="fg.muted" fontSize="lg">
            Discover what you can cook right now with your pantry ingredients.
          </Text>
        </Stack>

        {readyToCookCount > 0 && (
          <Box p={4} bg="green.50/50" borderColor="green.200" borderWidth="1px" borderRadius="xl">
            <HStack justify="space-between" align="center">
              <HStack gap={3}>
                <Text fontSize="2xl">🎉</Text>
                <Stack gap={0}>
                  <Text fontWeight="bold" color="green.800">
                    You can make {readyToCookCount} {readyToCookCount === 1 ? 'recipe' : 'recipes'} right now!
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    You have 100% of the required ingredients in your pantry.
                  </Text>
                </Stack>
              </HStack>
              <Button
                size="sm"
                colorPalette="green"
                variant={onlyCanMake ? 'solid' : 'outline'}
                onClick={() => setOnlyCanMake((prev) => !prev)}
              >
                {onlyCanMake ? 'Show All' : 'Filter Ready to Cook'}
              </Button>
            </HStack>
          </Box>
        )}

        <HStack gap={4} flexWrap="wrap">
          <Input
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW="sm"
          />
        </HStack>

        {recipesQuery.isLoading && <Text color="fg.muted">Matching recipes with your pantry…</Text>}
        {recipesQuery.isError && (
          <FormError message={(recipesQuery.error as Error).message} />
        )}

        {recipesQuery.isSuccess && filteredRecipes.length === 0 && (
          <Box p={8} textAlign="center" borderWidth="1px" borderRadius="xl">
            <Text fontSize="lg" fontWeight="semibold" mb={1}>No matching recipes found</Text>
            <Text color="fg.muted">Try adding more items to your pantry or clearing search filters.</Text>
          </Box>
        )}

        <Stack gap={4}>
          {filteredRecipes.map((recipe) => (
            <Box
              key={recipe.id}
              borderWidth="1px"
              borderRadius="xl"
              p={{ base: 5, md: 6 }}
              boxShadow="sm"
              bg="bg.panel"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md', borderColor: 'border.emphasized' }}
            >
              <Stack gap={4}>
                <HStack justify="space-between" align="flex-start" gap={4} flexWrap="wrap">
                  <Stack gap={1} flex="1">
                    <HStack gap={2} flexWrap="wrap">
                      <MatchBadge matchPercentage={recipe.matchPercentage} canMake={recipe.canMake} />
                      <Badge variant="outline">{recipe.difficulty}</Badge>
                      <Text fontSize="xs" color="fg.muted">
                        ⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins total
                      </Text>
                    </HStack>
                    <Heading size="lg" mt={1}>{recipe.title}</Heading>
                    <Text color="fg.muted" fontSize="sm">{recipe.description}</Text>
                  </Stack>
                  <Button
                    colorPalette={recipe.canMake ? 'green' : 'blue'}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                  >
                    View Recipe
                  </Button>
                </HStack>

                <Stack gap={2} pt={2} borderTopWidth="1px" borderColor="border.subtle">
                  <HStack gap={2} flexWrap="wrap" align="center">
                    <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                      HAVE ({recipe.matchedIngredients.length}):
                    </Text>
                    {recipe.matchedIngredients.length > 0 ? (
                      recipe.matchedIngredients.map((ing) => (
                        <Badge key={ing} colorPalette="green" variant="subtle" size="sm">
                          ✓ {ing}
                        </Badge>
                      ))
                    ) : (
                      <Text fontSize="xs" color="fg.muted">None</Text>
                    )}
                  </HStack>

                  {recipe.missingIngredients.length > 0 && (
                    <HStack gap={2} flexWrap="wrap" align="center">
                      <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                        MISSING ({recipe.missingIngredients.length}):
                      </Text>
                      {recipe.missingIngredients.map((ing) => (
                        <Badge key={ing} colorPalette="red" variant="subtle" size="sm">
                          ✕ {ing}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>

      {selectedRecipeId != null && (
        <RecipeDetailModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </Container>
  )
}
