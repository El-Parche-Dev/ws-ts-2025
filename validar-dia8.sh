#!/bin/bash

# 🏆 Script de Validación - Día 8: PHP Fundamentals + Laravel Setup
# WorldSkills 2025 Training - Backend Switch

echo "🔍 VALIDANDO DÍA 8: PHP FUNDAMENTALS + LARAVEL SETUP"
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para test
test_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        test_result 0 "Archivo existe: $1"
        return 0
    else
        test_result 1 "Archivo faltante: $1"
        return 1
    fi
}

# Función para verificar contenido
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        test_result 0 "Contenido encontrado en $1: $2"
        return 0
    else
        test_result 1 "Contenido faltante en $1: $2"
        return 1
    fi
}

echo -e "${BLUE}📁 1. ESTRUCTURA DE DIRECTORIOS${NC}"
echo "================================"

# Verificar estructura principal
BASE_DIR="entrenamiento/dia-08-php-laravel-setup"
check_file "$BASE_DIR/README.md"

# Verificar secciones
SECTIONS=("01-php8-syntax-moderno" "02-laravel-installation-structure" "03-artisan-routes-controllers" "04-blade-templates-basicos" "05-mvp-laravel-hello-world" "06-enhanced-dynamic-routes" "07-polish-basic-layout")

for section in "${SECTIONS[@]}"; do
    if [ -d "$BASE_DIR/$section" ]; then
        test_result 0 "Directorio existe: $section"
        check_file "$BASE_DIR/$section/README.md"
    else
        test_result 1 "Directorio faltante: $section"
    fi
done

echo -e "\n${BLUE}📝 2. ARCHIVOS DE CÓDIGO PHP${NC}"
echo "================================"

# Verificar archivo PHP 8+ moderno
PHP_FILE="$BASE_DIR/01-php8-syntax-moderno/ejercicio-productos.php"
check_file "$PHP_FILE"
if [ -f "$PHP_FILE" ]; then
    check_content "$PHP_FILE" "<?php"
    check_content "$PHP_FILE" "declare(strict_types=1)"
    check_content "$PHP_FILE" "enum"
    check_content "$PHP_FILE" "class Producto"
    check_content "$PHP_FILE" "readonly"
    check_content "$PHP_FILE" "match"
fi

echo -e "\n${BLUE}🎨 3. ARCHIVOS BLADE TEMPLATES${NC}"
echo "================================"

# Verificar layout maestro
LAYOUT_FILE="$BASE_DIR/07-polish-basic-layout/layouts/app.blade.php"
check_file "$LAYOUT_FILE"
if [ -f "$LAYOUT_FILE" ]; then
    check_content "$LAYOUT_FILE" "@yield('content')"
    check_content "$LAYOUT_FILE" "Bootstrap"
    check_content "$LAYOUT_FILE" "app-sidebar"
    check_content "$LAYOUT_FILE" "app-header"
fi

# Verificar componentes
COMPONENT_FILES=("$BASE_DIR/07-polish-basic-layout/components/card.blade.php" "$BASE_DIR/07-polish-basic-layout/components/button.blade.php" "$BASE_DIR/07-polish-basic-layout/components/alert.blade.php")

for component in "${COMPONENT_FILES[@]}"; do
    check_file "$component"
    if [ -f "$component" ]; then
        check_content "$component" "@props"
        check_content "$component" "{{ \$slot }}"
    fi
done

# Verificar vista avanzada de productos
PRODUCTS_VIEW="$BASE_DIR/07-polish-basic-layout/views/productos-advanced.blade.php"
check_file "$PRODUCTS_VIEW"
if [ -f "$PRODUCTS_VIEW" ]; then
    check_content "$PRODUCTS_VIEW" "@extends('layouts.app')"
    check_content "$PRODUCTS_VIEW" "product-grid"
    check_content "$PRODUCTS_VIEW" "@push('styles')"
    check_content "$PRODUCTS_VIEW" "@push('scripts')"
fi

echo -e "\n${BLUE}📖 4. DOCUMENTACIÓN Y README${NC}"
echo "================================"

# Verificar README principal
MAIN_README="$BASE_DIR/README.md"
if [ -f "$MAIN_README" ]; then
    check_content "$MAIN_README" "# 🚀 Día 8: PHP Fundamentals + Laravel Setup"
    check_content "$MAIN_README" "## 📋 Cronograma del Día"
    check_content "$MAIN_README" "MVP"
    check_content "$MAIN_README" "12:00-18:00"
fi

# Verificar READMEs de secciones
for section in "${SECTIONS[@]}"; do
    README_FILE="$BASE_DIR/$section/README.md"
    if [ -f "$README_FILE" ]; then
        check_content "$README_FILE" "# "
        check_content "$README_FILE" "MVP"
        check_content "$README_FILE" "minutos"
    fi
done

echo -e "\n${BLUE}🎯 5. CONTENIDO MVP ESPECÍFICO${NC}"
echo "================================"

# Verificar metodología MVP en READMEs
MVP_PATTERNS=("FASE CORE" "FASE ENHANCED" "FASE POLISH" "✅" "⚡" "✨")

for section in "${SECTIONS[@]}"; do
    README_FILE="$BASE_DIR/$section/README.md"
    if [ -f "$README_FILE" ]; then
        for pattern in "${MVP_PATTERNS[@]}"; do
            check_content "$README_FILE" "$pattern"
        done
    fi
done

echo -e "\n${BLUE}🔧 6. CÓDIGO WORLDSKILLS COMPLIANT${NC}"
echo "================================"

# Verificar estándares WorldSkills
if [ -f "$PHP_FILE" ]; then
    check_content "$PHP_FILE" "// Comentarios en español"
    check_content "$PHP_FILE" "validar"
    check_content "$PHP_FILE" "function"
fi

# Verificar CSS moderno en layout
if [ -f "$LAYOUT_FILE" ]; then
    check_content "$LAYOUT_FILE" "CSS Grid"
    check_content "$LAYOUT_FILE" "flexbox"
    check_content "$LAYOUT_FILE" ":root"
    check_content "$LAYOUT_FILE" "var(--"
    check_content "$LAYOUT_FILE" "@media"
fi

echo -e "\n${BLUE}📊 7. VERIFICACIÓN DE TIMEBOXING${NC}"
echo "================================"

# Verificar timeboxing en cada sección
EXPECTED_TIMES=("30min" "60min" "15min")

for section in "${SECTIONS[@]}"; do
    README_FILE="$BASE_DIR/$section/README.md"
    if [ -f "$README_FILE" ]; then
        time_found=false
        for time in "${EXPECTED_TIMES[@]}"; do
            if grep -q "$time" "$README_FILE" 2>/dev/null; then
                time_found=true
                break
            fi
        done
        
        if [ "$time_found" = true ]; then
            test_result 0 "Timeboxing encontrado en $section"
        else
            test_result 1 "Timeboxing faltante en $section"
        fi
    fi
done

echo -e "\n${BLUE}🏆 8. PREPARACIÓN PARA COMPETENCIA${NC}"
echo "================================"

# Verificar elementos específicos de competencia
COMPETITION_ELEMENTS=("WorldSkills" "competencia" "2025" "Backend" "Frontend")

for element in "${COMPETITION_ELEMENTS[@]}"; do
    if grep -r "$element" "$BASE_DIR" >/dev/null 2>&1; then
        test_result 0 "Elemento de competencia encontrado: $element"
    else
        test_result 1 "Elemento de competencia faltante: $element"
    fi
done

echo -e "\n${YELLOW}📈 RESUMEN DE VALIDACIÓN${NC}"
echo "========================="
echo -e "Total de tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests pasados: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Tests fallidos: ${RED}$FAILED_TESTS${NC}"

# Calcular porcentaje
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Porcentaje de éxito: ${BLUE}$PERCENTAGE%${NC}"
    
    if [ $PERCENTAGE -ge 90 ]; then
        echo -e "\n${GREEN}🎉 ¡EXCELENTE! Día 8 está listo para entrenamiento WorldSkills${NC}"
        echo -e "${GREEN}✅ Todas las secciones implementadas correctamente${NC}"
        echo -e "${GREEN}✅ Metodología MVP aplicada${NC}"
        echo -e "${GREEN}✅ Timeboxing configurado${NC}"
        echo -e "${GREEN}✅ Código preparado para competencia${NC}"
    elif [ $PERCENTAGE -ge 75 ]; then
        echo -e "\n${YELLOW}⚠️  BUENO - Día 8 está funcional pero necesita ajustes menores${NC}"
    else
        echo -e "\n${RED}❌ REQUIERE TRABAJO - Día 8 necesita correcciones importantes${NC}"
    fi
else
    echo -e "\n${RED}❌ ERROR - No se pudieron ejecutar tests${NC}"
fi

echo -e "\n${BLUE}🚀 PRÓXIMOS PASOS${NC}"
echo "=================="
echo "1. Si validación exitosa: Proceder con Día 9 (Laravel Models + SQLite)"
echo "2. Si hay errores: Revisar archivos faltantes y corregir"
echo "3. Ejecutar entrenamiento práctico de 6 horas"
echo "4. Validar con estudiantes reales"

exit $FAILED_TESTS
