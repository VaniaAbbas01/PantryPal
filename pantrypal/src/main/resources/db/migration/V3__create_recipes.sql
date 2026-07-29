CREATE TABLE recipes (
    id                 BIGSERIAL PRIMARY KEY,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    instructions       TEXT         NOT NULL,
    prep_time_minutes  INT          NOT NULL DEFAULT 0,
    cook_time_minutes  INT          NOT NULL DEFAULT 0,
    servings           INT          NOT NULL DEFAULT 1,
    difficulty         VARCHAR(50)  NOT NULL DEFAULT 'Easy',
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE recipe_ingredients (
    id          BIGSERIAL PRIMARY KEY,
    recipe_id   BIGINT       NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    quantity    NUMERIC(10, 2),
    unit        VARCHAR(50),
    is_optional BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX ix_recipe_ingredients_recipe_id ON recipe_ingredients (recipe_id);
CREATE INDEX ix_recipe_ingredients_name ON recipe_ingredients (LOWER(name));

-- Seed recipes
INSERT INTO recipes (id, title, description, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty) VALUES
(1, 'Classic Scrambled Eggs', 'Fluffy, creamy scrambled eggs cooked gently with butter.',
 '1. Beat eggs in a bowl with a pinch of salt and pepper.\n2. Melt butter in a non-stick skillet over low-medium heat.\n3. Pour in eggs and gently push with a spatula until soft curds form.\n4. Remove from heat while still slightly moist.',
 3, 5, 2, 'Easy'),

(2, 'Crispy Cheese Toastie', 'Golden, melted grilled cheese sandwich.',
 '1. Butter one side of each bread slice.\n2. Place cheese between the unbuttered sides of the bread.\n3. Heat pan over medium heat and cook sandwich for 3-4 minutes per side until golden and cheese melts.',
 2, 8, 1, 'Easy'),

(3, 'Quick Egg Fried Rice', 'A simple savory fried rice using pantry staples.',
 '1. Heat oil in a pan or skillet over medium-high heat.\n2. Sauté minced garlic until fragrant (30 secs).\n3. Push garlic to side, scramble beaten eggs in the pan.\n4. Stir in cooked rice and soy sauce; fry together for 3 minutes.',
 5, 10, 2, 'Easy'),

(4, 'Garlic Butter Pasta', 'Rich and comforting pasta tossed with garlic, butter, and parmesan.',
 '1. Boil pasta in salted water according to package instructions; drain.\n2. In a pan, melt butter over medium heat and sauté minced garlic for 1 minute.\n3. Toss boiled pasta into garlic butter, sprinkle with parmesan cheese, salt, and pepper.',
 5, 12, 2, 'Easy'),

(5, 'Fluffy Pancakes', 'Classic golden breakfast pancakes.',
 '1. Whisk flour, sugar, and a pinch of salt in a bowl.\n2. In another bowl, mix milk, egg, and melted butter.\n3. Combine wet and dry ingredients into a smooth batter.\n4. Ladle batter onto a hot buttered pan and cook until bubbles form, then flip.',
 10, 10, 3, 'Easy'),

(6, 'Simple Cheese Omelette', 'Warm and cheesy folded omelette.',
 '1. Beat eggs with milk, salt, and pepper.\n2. Pour into a heated buttered pan and let set.\n3. Sprinkle grated cheese on one half and fold over. Serve hot.',
 3, 5, 1, 'Easy'),

(7, 'Tomato Basil Pasta', 'Fresh and flavorful pasta with simple tomato garlic sauce.',
 '1. Cook pasta until al dente.\n2. In a skillet, heat olive oil and cook garlic and chopped tomatoes until softened into a sauce.\n3. Season with salt and pepper, then toss with pasta.',
 10, 15, 2, 'Easy');

-- Seed recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, is_optional) VALUES
-- Scrambled Eggs
(1, 'Eggs', 3, 'count', false),
(1, 'Butter', 1, 'tbsp', false),
(1, 'Salt', 0.5, 'tsp', true),
(1, 'Pepper', 0.25, 'tsp', true),

-- Cheese Toastie
(2, 'Bread', 2, 'slices', false),
(2, 'Cheese', 2, 'slices', false),
(2, 'Butter', 1, 'tbsp', false),

-- Egg Fried Rice
(3, 'Rice', 2, 'cups', false),
(3, 'Eggs', 2, 'count', false),
(3, 'Garlic', 2, 'cloves', false),
(3, 'Soy Sauce', 1, 'tbsp', false),
(3, 'Oil', 1, 'tbsp', false),

-- Garlic Butter Pasta
(4, 'Pasta', 200, 'g', false),
(4, 'Garlic', 3, 'cloves', false),
(4, 'Butter', 2, 'tbsp', false),
(4, 'Parmesan Cheese', 30, 'g', true),
(4, 'Salt', 1, 'tsp', true),

-- Fluffy Pancakes
(5, 'Flour', 1.5, 'cups', false),
(5, 'Milk', 1, 'cup', false),
(5, 'Eggs', 1, 'count', false),
(5, 'Sugar', 2, 'tbsp', false),
(5, 'Butter', 2, 'tbsp', false),

-- Cheese Omelette
(6, 'Eggs', 2, 'count', false),
(6, 'Cheese', 50, 'g', false),
(6, 'Milk', 2, 'tbsp', true),
(6, 'Butter', 1, 'tbsp', false),

-- Tomato Basil Pasta
(7, 'Pasta', 200, 'g', false),
(7, 'Tomato', 2, 'count', false),
(7, 'Garlic', 2, 'cloves', false),
(7, 'Olive Oil', 2, 'tbsp', false),
(7, 'Salt', 1, 'tsp', true);

SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));
SELECT setval('recipe_ingredients_id_seq', (SELECT MAX(id) FROM recipe_ingredients));
