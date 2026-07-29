import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError, pantryApi } from '../lib/api'
import type { CreatePantryItemRequest, PantryItem } from '../lib/api'
import { FormError } from '../components/AuthShell'

const PANTRY_QUERY_KEY = ['pantry'] as const

interface ItemFormState {
  name: string
  quantity: string
  unit: string
  category: string
  expiresAt: string
}

const emptyForm = (): ItemFormState => ({
  name: '',
  quantity: '',
  unit: '',
  category: '',
  expiresAt: '',
})

function toRequest(form: ItemFormState): CreatePantryItemRequest {
  const body: CreatePantryItemRequest = { name: form.name.trim() }
  const quantity = form.quantity.trim()
  const unit = form.unit.trim()
  const category = form.category.trim()
  const expiresAt = form.expiresAt.trim()
  if (quantity) body.quantity = Number(quantity)
  if (unit) body.unit = unit
  if (category) body.category = category
  if (expiresAt) body.expiresAt = expiresAt
  return body
}

function formatQuantity(item: PantryItem): string | null {
  if (item.quantity == null) return null
  const amount = Number.isInteger(item.quantity)
    ? String(item.quantity)
    : String(item.quantity)
  return item.unit ? `${amount} ${item.unit}` : amount
}

function ItemForm({
  initial,
  submitLabel,
  loading,
  error,
  onSubmit,
  onCancel,
}: {
  initial: ItemFormState
  submitLabel: string
  loading: boolean
  error: Error | null
  onSubmit: (form: ItemFormState) => void
  onCancel?: () => void
}) {
  const [form, setForm] = useState(initial)
  const fieldErrors = error instanceof ApiError ? error.fieldErrors : {}
  const generalError =
    error && !(error instanceof ApiError && Object.keys(error.fieldErrors).length > 0)
      ? error.message
      : null

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
    >
      <Stack gap={4}>
        {generalError && <FormError message={generalError} />}
        <Field.Root required invalid={!!fieldErrors.name}>
          <Field.Label>Ingredient</Field.Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Eggs"
          />
          <Field.ErrorText>{fieldErrors.name}</Field.ErrorText>
        </Field.Root>
        <HStack gap={4} align="flex-start">
          <Field.Root invalid={!!fieldErrors.quantity}>
            <Field.Label>Quantity</Field.Label>
            <Input
              type="number"
              min={0}
              step="any"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              placeholder="12"
            />
            <Field.ErrorText>{fieldErrors.quantity}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!fieldErrors.unit}>
            <Field.Label>Unit</Field.Label>
            <Input
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="count, g, ml"
            />
            <Field.ErrorText>{fieldErrors.unit}</Field.ErrorText>
          </Field.Root>
        </HStack>
        <HStack gap={4} align="flex-start">
          <Field.Root invalid={!!fieldErrors.category}>
            <Field.Label>Category</Field.Label>
            <Input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Dairy, Produce"
            />
            <Field.ErrorText>{fieldErrors.category}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!fieldErrors.expiresAt}>
            <Field.Label>Expires</Field.Label>
            <Input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
            />
            <Field.ErrorText>{fieldErrors.expiresAt}</Field.ErrorText>
          </Field.Root>
        </HStack>
        <HStack gap={3}>
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </HStack>
      </Stack>
    </form>
  )
}

export function PantryPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [createFormKey, setCreateFormKey] = useState(0)

  const pantryQuery = useQuery({
    queryKey: PANTRY_QUERY_KEY,
    queryFn: pantryApi.list,
  })

  const createMutation = useMutation({
    mutationFn: pantryApi.create,
    onSuccess: () => {
      setCreateFormKey((key) => key + 1)
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: CreatePantryItemRequest }) =>
      pantryApi.update(id, body),
    onSuccess: () => {
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: pantryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY })
    },
  })

  return (
    <Container maxW="3xl">
      <Stack gap={8}>
        <Stack gap={1}>
          <Heading size="2xl">My Pantry 🛒</Heading>
          <Text color="fg.muted">
            Add ingredients you have on hand to find matching recipes.
          </Text>
        </Stack>

        <Box borderWidth="1px" borderRadius="xl" p={{ base: 5, md: 6 }} boxShadow="sm">
          <Stack gap={4}>
            <Heading size="md">Add ingredient</Heading>
            <ItemForm
              key={createFormKey}
              initial={emptyForm()}
              submitLabel="Add to pantry"
              loading={createMutation.isPending}
              error={createMutation.error}
              onSubmit={(form) => createMutation.mutate(toRequest(form))}
            />
          </Stack>
        </Box>

        <Stack gap={4}>
          <Heading size="md">On hand</Heading>
          {pantryQuery.isLoading && <Text color="fg.muted">Loading pantry…</Text>}
          {pantryQuery.isError && (
            <FormError message={(pantryQuery.error as Error).message} />
          )}
          {pantryQuery.data?.length === 0 && (
            <Text color="fg.muted">No ingredients yet — add your first item above.</Text>
          )}
          {pantryQuery.data?.map((item) =>
            editingId === item.id ? (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
                boxShadow="sm"
              >
                <ItemForm
                  initial={{
                    name: item.name,
                    quantity: item.quantity != null ? String(item.quantity) : '',
                    unit: item.unit ?? '',
                    category: item.category ?? '',
                    expiresAt: item.expiresAt ?? '',
                  }}
                  submitLabel="Save changes"
                  loading={updateMutation.isPending}
                  error={updateMutation.error}
                  onSubmit={(form) =>
                    updateMutation.mutate({ id: item.id, body: toRequest(form) })
                  }
                  onCancel={() => setEditingId(null)}
                />
              </Box>
            ) : (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
              >
                <HStack justify="space-between" align="flex-start" gap={4}>
                  <Stack gap={1}>
                    <Text fontWeight="semibold">{item.name}</Text>
                    <Text color="fg.muted" fontSize="sm">
                      {[formatQuantity(item), item.category, item.expiresAt && `expires ${item.expiresAt}`]
                        .filter(Boolean)
                        .join(' · ') || 'No extra details'}
                    </Text>
                  </Stack>
                  <HStack gap={2}>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(item.id)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      loading={deleteMutation.isPending && deleteMutation.variables === item.id}
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ),
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
