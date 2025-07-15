#!/bin/bash

# 🎯 Script de Validación - Día 9: Laravel Models + SQLite
# WorldSkills 2025 - Entrenamiento Intensivo
# Validación completa de todas las secciones implementadas

echo "🚀 Iniciando validación del Día 9: Laravel Models + SQLite"
echo "=============================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Función para verificar archivos
check_file() {
    local file_path="$1"
    local description="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "   📁 Archivo faltante: $file_path"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar directorios
check_directory() {
    local dir_path="$1"
    local description="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir_path" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "   📁 Directorio faltante: $dir_path"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar contenido de archivo
check_file_content() {
    local file_path="$1"
    local search_pattern="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file_path" ] && grep -q "$search_pattern" "$file_path"; then
        echo -e "${GREEN}✅ $description${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "   🔍 Patrón no encontrado: $search_pattern en $file_path"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

echo ""
echo "🔍 VALIDACIÓN ESTRUCTURA GENERAL"
echo "================================"

# Verificar estructura principal
check_directory "entrenamiento/dia-09-laravel-models-sqlite" "Directorio principal del día 9"
check_file "entrenamiento/dia-09-laravel-models-sqlite/README.md" "README principal con cronograma"

echo ""
echo "📋 SECCIÓN 01: SQLite Setup Config"
echo "=================================="

check_directory "entrenamiento/dia-09-laravel-models-sqlite/01-sqlite-setup-config" "Directorio sección 01"
check_file "entrenamiento/dia-09-laravel-models-sqlite/01-sqlite-setup-config/README.md" "README sección 01"
check_file "entrenamiento/dia-09-laravel-models-sqlite/01-sqlite-setup-config/.env.example" "Archivo .env.example"
check_file "entrenamiento/dia-09-laravel-models-sqlite/01-sqlite-setup-config/config-database.php" "Configuración database"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/01-sqlite-setup-config/.env.example" "DB_CONNECTION=sqlite" "Configuración SQLite en .env.example"

echo ""
echo "🗃️ SECCIÓN 02: Migrations Models Básicos"
echo "========================================"

check_directory "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos" "Directorio sección 02"
check_file "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/README.md" "README sección 02"
check_file "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/create_productos_table.php" "Migración productos"
check_file "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/Producto.php" "Modelo Producto"
check_file "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/ProductoSeeder.php" "Seeder productos"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/Producto.php" "class Producto extends Model" "Modelo Producto extiende Model"
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/02-migrations-models-basicos/create_productos_table.php" "Schema::create" "Migración con Schema::create"

echo ""
echo "💾 SECCIÓN 03: Eloquent CRUD Operations"
echo "======================================"

check_directory "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations" "Directorio sección 03"
check_file "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations/README.md" "README sección 03"
check_file "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations/ProductoController.php" "Controlador Producto"
check_file "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations/eloquent-examples.php" "Ejemplos Eloquent"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations/ProductoController.php" "class ProductoController" "Controlador definido correctamente"
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/03-eloquent-crud-operations/eloquent-examples.php" "Producto::create" "Ejemplos CRUD en Eloquent"

echo ""
echo "🔗 SECCIÓN 04: Relationships Básicas"
echo "==================================="

check_directory "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas" "Directorio sección 04"
check_file "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas/README.md" "README sección 04"
check_file "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas/Categoria.php" "Modelo Categoria"
check_file "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas/create_categorias_table.php" "Migración categorías"
check_file "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas/relationships-demo.php" "Demo relaciones"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/04-relationships-basicas/Categoria.php" "belongsTo\|hasMany" "Relaciones definidas en modelos"

echo ""
echo "🎯 SECCIÓN 05: MVP Products CRUD"
echo "==============================="

check_directory "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud" "Directorio sección 05"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/README.md" "README sección 05"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/ProductController.php" "ProductController completo"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/ProductRequest.php" "Form Request"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/routes.php" "Rutas resource"
check_directory "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/views" "Directorio views"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/views/layout.blade.php" "Layout Blade"
check_file "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/views/index.blade.php" "Vista index"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/ProductController.php" "FASE CORE\|FASE ENHANCED\|FASE POLISH" "Implementación MVP en controlador"
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/05-mvp-products-crud/routes.php" "Route::resource" "Rutas resource definidas"

echo ""
echo "✅ SECCIÓN 06: Enhanced Form Validation"
echo "======================================"

check_directory "entrenamiento/dia-09-laravel-models-sqlite/06-enhanced-form-validation" "Directorio sección 06"
check_file "entrenamiento/dia-09-laravel-models-sqlite/06-enhanced-form-validation/README.md" "README sección 06"
check_file "entrenamiento/dia-09-laravel-models-sqlite/06-enhanced-form-validation/ProductValidationRequest.php" "Request validación avanzada"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/06-enhanced-form-validation/ProductValidationRequest.php" "withValidator\|validateBusinessRules" "Validaciones avanzadas implementadas"

echo ""
echo "🛠️ SECCIÓN 07: Polish Error Handling"
echo "==================================="

check_directory "entrenamiento/dia-09-laravel-models-sqlite/07-polish-error-handling" "Directorio sección 07"
check_file "entrenamiento/dia-09-laravel-models-sqlite/07-polish-error-handling/README.md" "README sección 07"
check_file "entrenamiento/dia-09-laravel-models-sqlite/07-polish-error-handling/ExceptionHandler.php" "Exception Handler personalizado"

# Verificar contenido específico
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/07-polish-error-handling/ExceptionHandler.php" "handleDatabaseException\|logExceptionWithContext" "Error handling avanzado implementado"

echo ""
echo "🔍 VALIDACIÓN DE CONTENIDO MVP"
echo "============================="

# Verificar implementación MVP en archivos clave
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/README.md" "CORE\|ENHANCED\|POLISH" "Metodología MVP documentada"
check_file_content "entrenamiento/dia-09-laravel-models-sqlite/README.md" "12:00-18:00" "Cronograma 6 horas documentado"

# Verificar que todos los README tienen estructura MVP
for section in 01 02 03 04 05 06 07; do
    section_dir="entrenamiento/dia-09-laravel-models-sqlite/0${section}-*"
    if ls $section_dir 1> /dev/null 2>&1; then
        readme_file=$(find $section_dir -name "README.md" -type f | head -1)
        if [ -f "$readme_file" ]; then
            check_file_content "$readme_file" "CORE\|ENHANCED\|POLISH\|MVP" "Estructura MVP en README sección $section"
        fi
    fi
done

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "======================="

# Calcular porcentaje
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
else
    SUCCESS_PERCENTAGE=0
fi

echo -e "Total de verificaciones: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED_CHECKS${NC}"
echo -e "Porcentaje de éxito: ${BLUE}$SUCCESS_PERCENTAGE%${NC}"

echo ""
if [ $SUCCESS_PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}🏆 ¡EXCELENTE! El Día 9 está implementado correctamente${NC}"
    echo -e "${GREEN}✅ Listo para entrenamiento WorldSkills 2025${NC}"
    exit 0
elif [ $SUCCESS_PERCENTAGE -ge 75 ]; then
    echo -e "${YELLOW}⚠️  BUENO - Algunas mejoras necesarias${NC}"
    echo -e "${YELLOW}🔧 Revisar elementos faltantes antes del entrenamiento${NC}"
    exit 1
else
    echo -e "${RED}❌ NECESITA TRABAJO - Implementación incompleta${NC}"
    echo -e "${RED}🛠️  Completar elementos faltantes antes del entrenamiento${NC}"
    exit 2
fi
