package com.vaniaabbas.pantrypal.pantry;

import com.vaniaabbas.pantrypal.pantry.dto.CreatePantryItemRequest;
import com.vaniaabbas.pantrypal.pantry.dto.PantryItemResponse;
import com.vaniaabbas.pantrypal.pantry.dto.UpdatePantryItemRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pantry")
public class PantryController {

    private final PantryService pantryService;

    public PantryController(PantryService pantryService) {
        this.pantryService = pantryService;
    }

    @GetMapping
    public List<PantryItemResponse> listItems() {
        return pantryService.listItems();
    }

    @GetMapping("/{id}")
    public PantryItemResponse getItem(@PathVariable Long id) {
        return pantryService.getItem(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PantryItemResponse createItem(@Valid @RequestBody CreatePantryItemRequest request) {
        return pantryService.createItem(request);
    }

    @PutMapping("/{id}")
    public PantryItemResponse updateItem(
            @PathVariable Long id, @Valid @RequestBody UpdatePantryItemRequest request) {
        return pantryService.updateItem(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        pantryService.deleteItem(id);
    }
}
