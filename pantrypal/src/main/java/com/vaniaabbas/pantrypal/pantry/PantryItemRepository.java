package com.vaniaabbas.pantrypal.pantry;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {

    List<PantryItem> findByUserIdOrderByNameAsc(Long userId);

    Optional<PantryItem> findByIdAndUserId(Long id, Long userId);
}
