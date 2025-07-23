# 💻 EJERCICIO 2: Blog System - Relationships Avanzadas

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Crear un sistema de blog completo con User, Post, Comment y Tag models, implementando relationships 1:1, 1:N, N:N y scopes avanzados.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ 4 Models con relationships complejas
- ✅ Migrations con constraints
- ✅ Polymorphic relationships (tags)
- ✅ Query scopes avanzados

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Eager loading optimization
- ⚡ Global scopes
- ⚡ Model observers
- ⚡ Custom collection methods

---

## 🏗️ **ESTRUCTURA DEL SISTEMA**

```
Users (1) -----> (N) Posts
Posts (1) -----> (N) Comments
Users (1) -----> (N) Comments
Tags (N) <-----> (N) Posts (Polymorphic)
Tags (N) <-----> (N) Comments (Polymorphic)
```

---

## 🏗️ **PASO A PASO**

### **1. Crear Models y Migrations**

```bash
php artisan make:model User -m
php artisan make:model Post -mf
php artisan make:model Comment -mf
php artisan make:model Tag -mf
php artisan make:migration create_taggables_table
```

### **2. Implementar Migrations**

**Users Migration:**

```php
<?php
// TODO: Completar users migration

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('username', 50)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('preferences')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // TODO: Agregar índices
            $table->index(['is_active', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

**Posts Migration:**

```php
<?php
// TODO: Implementar posts migration

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->json('meta')->nullable(); // SEO, etc.
            $table->timestamps();

            // TODO: Agregar índices
            $table->index(['user_id', 'status', 'published_at']);
            $table->index('slug');
            $table->fullText(['title', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

**Comments Migration:**

```php
<?php
// TODO: Implementar comments migration

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_approved')->default(false);
            $table->integer('likes_count')->default(0);
            $table->timestamps();

            // TODO: Agregar índices
            $table->index(['post_id', 'is_approved', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
```

**Tags Migration:**

```php
<?php
// TODO: Implementar tags migration

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('slug', 60)->unique();
            $table->string('color', 7)->default('#6B7280');
            $table->text('description')->nullable();
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            // TODO: Agregar índices
            $table->index(['usage_count', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
```

**Polymorphic Taggables Migration:**

```php
<?php
// TODO: Implementar taggables polymorphic table

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taggables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->morphs('taggable'); // taggable_id, taggable_type
            $table->timestamps();

            // TODO: Agregar índices únicos
            $table->unique(['tag_id', 'taggable_id', 'taggable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggables');
    }
};
```

---

## 🏗️ **IMPLEMENTAR MODELS**

### **User Model Template:**

```php
<?php
// app/Models/User.php - COMPLETAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'username', 'password', 'avatar', 'bio', 'is_active', 'preferences'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'preferences' => 'array',
    ];

    // TODO: Implementar relationships
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function publishedPosts(): HasMany
    {
        return $this->hasMany(Post::class)->where('status', 'published');
    }

    // TODO: Implementar scopes
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeWithPostsCount(Builder $query): void
    {
        $query->withCount(['posts', 'publishedPosts']);
    }

    // TODO: Implementar accessors
    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : asset('images/default-avatar.png');
    }

    // TODO: Implementar métodos de utilidad
    public function getRouteKeyName(): string
    {
        return 'username';
    }
}
```

### **Post Model Template:**

```php
<?php
// app/Models/Post.php - COMPLETAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'status', 'published_at', 'meta'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'meta' => 'array',
    ];

    // TODO: Implementar relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function approvedComments(): HasMany
    {
        return $this->hasMany(Comment::class)->where('is_approved', true);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // TODO: Implementar scopes
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')
              ->whereNotNull('published_at')
              ->where('published_at', '<=', now());
    }

    public function scopeByUser(Builder $query, string $username): void
    {
        $query->whereHas('user', function (Builder $q) use ($username) {
            $q->where('username', $username);
        });
    }

    public function scopeWithTag(Builder $query, string $tagSlug): void
    {
        $query->whereHas('tags', function (Builder $q) use ($tagSlug) {
            $q->where('slug', $tagSlug);
        });
    }

    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'LIKE', "%{$term}%")
              ->orWhere('content', 'LIKE', "%{$term}%")
              ->orWhere('excerpt', 'LIKE', "%{$term}%");
        });
    }

    // TODO: Implementar accessors
    protected function readingTime(): Attribute
    {
        return Attribute::make(
            get: function () {
                $wordCount = str_word_count(strip_tags($this->content));
                return ceil($wordCount / 200); // 200 words per minute
            }
        );
    }

    protected function isPublished(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'published' &&
                         $this->published_at !== null &&
                         $this->published_at <= now()
        );
    }

    // TODO: Implementar mutators
    protected function title(): Attribute
    {
        return Attribute::make(
            set: function (string $value) {
                $this->attributes['slug'] = \Str::slug($value);
                return ucfirst(trim($value));
            }
        );
    }

    // TODO: Implementar métodos
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
```

---

## 🎯 **DESAFÍOS A RESOLVER**

### **Desafío 1: Comentarios Anidados**

```php
// TODO: Implementar en Comment Model
public function replies(): HasMany
{
    return $this->hasMany(Comment::class, 'parent_id');
}

public function parent(): BelongsTo
{
    return $this->belongsTo(Comment::class, 'parent_id');
}

// Scope para comentarios principales
public function scopeParent(Builder $query): void
{
    $query->whereNull('parent_id');
}
```

### **Desafío 2: Global Scope para Posts Publicados**

```php
// TODO: Crear PublishedScope
<?php
namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('status', 'published')
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now());
    }
}
```

### **Desafío 3: Factories Complejas**

```php
// TODO: PostFactory con relationships
<?php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->sentence(6, true);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => \Str::slug($title),
            'excerpt' => $this->faker->paragraph(2),
            'content' => $this->faker->paragraphs(8, true),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'published_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-1 year') : null,
            'views_count' => $this->faker->numberBetween(0, 1000),
            'likes_count' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-6 months'),
        ]);
    }
}
```

---

## 🧪 **TESTING COMMANDS**

```bash
# Ejecutar migrations
php artisan migrate:fresh

# Crear datos de prueba
php artisan tinker

# En tinker:
>>> User::factory(5)->create()
>>> Post::factory(20)->published()->create()
>>> Comment::factory(50)->create()
>>> Tag::factory(10)->create()

# Probar relationships
>>> $user = User::first()
>>> $user->posts
>>> $user->publishedPosts

>>> $post = Post::with(['user', 'comments', 'tags'])->first()
>>> $post->user->name
>>> $post->comments->count()
>>> $post->reading_time

# Probar scopes
>>> Post::published()->get()
>>> Post::withTag('laravel')->get()
>>> Post::search('tutorial')->get()
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] 4 Models con relationships correctas (4 pts)
- [ ] Migrations ejecutan sin errores (3 pts)
- [ ] Polymorphic relationships funcionando (3 pts)
- [ ] Scopes básicos implementados (3 pts)
- [ ] Factories generan datos válidos (2 pts)

### **ENHANCED (5 puntos)**

- [ ] Eager loading optimizado (2 pts)
- [ ] Global scopes implementados (1 pt)
- [ ] Accessors/mutators avanzados (1 pt)
- [ ] Comentarios anidados funcionando (1 pt)

---

## 🚀 **RETO EXTRA**

1. **Sistema de likes** (polymorphic)
2. **Bookmarks de usuarios**
3. **Post series/collections**
4. **Full-text search** con índices
5. **Analytics dashboard**

---

**¡Domina relationships complejas en Laravel!** 💪
