package com.vaniaabbas.pantrypal.pantry;

public class PantryItemNotFoundException extends RuntimeException {

    public PantryItemNotFoundException(Long id) {
        super("Pantry item not found: " + id);
    }
}
