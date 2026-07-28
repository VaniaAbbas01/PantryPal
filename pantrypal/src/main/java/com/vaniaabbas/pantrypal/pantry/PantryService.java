package com.vaniaabbas.pantrypal.pantry;

import com.vaniaabbas.pantrypal.config.CurrentUserService;
import com.vaniaabbas.pantrypal.pantry.dto.CreatePantryItemRequest;
import com.vaniaabbas.pantrypal.pantry.dto.PantryItemResponse;
import com.vaniaabbas.pantrypal.pantry.dto.UpdatePantryItemRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PantryService {

    private final PantryItemRepository pantryItemRepository;
    private final CurrentUserService currentUserService;

    public PantryService(PantryItemRepository pantryItemRepository, CurrentUserService currentUserService) {
        this.pantryItemRepository = pantryItemRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<PantryItemResponse> listItems() {
        long userId = currentUserService.requireUserId();
        return pantryItemRepository.findByUserIdOrderByNameAsc(userId).stream()
                .map(PantryItemResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PantryItemResponse getItem(Long id) {
        return PantryItemResponse.from(requireOwnedItem(id));
    }

    @Transactional
    public PantryItemResponse createItem(CreatePantryItemRequest request) {
        long userId = currentUserService.requireUserId();
        PantryItem item = new PantryItem(
                userId,
                request.name(),
                request.quantity(),
                request.unit(),
                request.category(),
                request.expiresAt());
        return PantryItemResponse.from(pantryItemRepository.save(item));
    }

    @Transactional
    public PantryItemResponse updateItem(Long id, UpdatePantryItemRequest request) {
        PantryItem item = requireOwnedItem(id);
        item.setName(request.name());
        item.setQuantity(request.quantity());
        item.setUnit(request.unit());
        item.setCategory(request.category());
        item.setExpiresAt(request.expiresAt());
        return PantryItemResponse.from(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        PantryItem item = requireOwnedItem(id);
        pantryItemRepository.delete(item);
    }

    private PantryItem requireOwnedItem(Long id) {
        long userId = currentUserService.requireUserId();
        return pantryItemRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new PantryItemNotFoundException(id));
    }
}
