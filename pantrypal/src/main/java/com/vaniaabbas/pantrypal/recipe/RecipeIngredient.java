package com.vaniaabbas.pantrypal.recipe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "recipe_ingredients")
@Getter
@Setter
@NoArgsConstructor
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(nullable = false)
    private String name;

    private BigDecimal quantity;

    private String unit;

    @Column(name = "is_optional", nullable = false)
    private boolean isOptional = false;

    public RecipeIngredient(String name, BigDecimal quantity, String unit, boolean isOptional) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOptional = isOptional;
    }
}
