#!/bin/bash

# 🎯 Script de Validación - Día 2: CSS Animaciones Básicas
# WorldSkills 2025 Training - Optimizado para 6 horas exactas

echo "🔍 VALIDANDO DÍA 2: CSS ANIMACIONES BÁSICAS"
echo "============================================="

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

echo -e "${BLUE}📁 1. ESTRUCTURA OPTIMIZADA (4 secciones exactas)${NC}"
echo "=================================================="

# Verificar estructura principal
BASE_DIR="entrenamiento/dia-02-css-animaciones"
check_file "$BASE_DIR/README.md"

# Verificar SOLO las 4 secciones esenciales para 6h
ESSENTIAL_SECTIONS=("01-css-animations-keyframes" "02-css-transforms-2d-3d" "03-css-transitions-timing" "04-proyecto-final")

for section in "${ESSENTIAL_SECTIONS[@]}"; do
    if [ -d "$BASE_DIR/$section" ]; then
        test_result 0 "Sección esencial existe: $section"
        check_file "$BASE_DIR/$section/README.md"
        check_file "$BASE_DIR/$section/index.html"
    else
        test_result 1 "Sección esencial faltante: $section"
    fi
done

echo -e "\n${BLUE}🗑️ 2. SECCIONES ELIMINADAS (Optimización de tiempo)${NC}"
echo "=================================================="

# Verificar que las secciones problemáticas fueron eliminadas
REMOVED_SECTIONS=("05-css-clipping-masking" "06-css-filters-blend-modes" "07-microinteracciones-loading" "08-challenge-sistema-animaciones" "09-speed-test-animaciones" "10-proyecto-integrador-portfolio")

for section in "${REMOVED_SECTIONS[@]}"; do
    if [ ! -d "$BASE_DIR/$section" ]; then
        test_result 0 "Sección correctamente eliminada: $section"
    else
        test_result 1 "Sección debe ser eliminada: $section"
    fi
done

echo -e "\n${BLUE}📝 3. CONTENIDO CSS Y HTML${NC}"
echo "================================"

# Verificar archivos CSS específicos
CSS_FILES=("$BASE_DIR/01-css-animations-keyframes/animations.css" "$BASE_DIR/02-css-transforms-2d-3d/transforms.css" "$BASE_DIR/03-css-transitions-timing/transitions.css" "$BASE_DIR/04-proyecto-final/animations.css")

for css_file in "${CSS_FILES[@]}"; do
    check_file "$css_file"
    if [ -f "$css_file" ]; then
        check_content "$css_file" "@keyframes"
    fi
done

# Verificar archivos HTML
HTML_FILES=("$BASE_DIR/01-css-animations-keyframes/index.html" "$BASE_DIR/02-css-transforms-2d-3d/index.html" "$BASE_DIR/03-css-transitions-timing/index.html" "$BASE_DIR/04-proyecto-final/index.html")

for html_file in "${HTML_FILES[@]}"; do
    check_file "$html_file"
    if [ -f "$html_file" ]; then
        check_content "$html_file" "<!DOCTYPE html>"
        check_content "$html_file" "<link.*css"
    fi
done

echo -e "\n${BLUE}⏱️ 4. TIMEBOXING DE 6 HORAS${NC}"
echo "==============================="

# Verificar cronograma en README principal
MAIN_README="$BASE_DIR/README.md"
if [ -f "$MAIN_README" ]; then
    check_content "$MAIN_README" "6 horas"
    check_content "$MAIN_README" "12:00 PM - 6:00 PM"
    check_content "$MAIN_README" "BLOQUE 1:"
    check_content "$MAIN_README" "BLOQUE 2:"
    check_content "$MAIN_README" "BLOQUE 3:"
    check_content "$MAIN_README" "BLOQUE 4:"
fi

echo -e "\n${BLUE}🎯 5. METODOLOGÍA MVP${NC}"
echo "======================="

# Verificar metodología MVP en secciones
MVP_PATTERNS=("CORE" "ENHANCED" "POLISH" "MVP")

for section in "${ESSENTIAL_SECTIONS[@]}"; do
    README_FILE="$BASE_DIR/$section/README.md"
    if [ -f "$README_FILE" ]; then
        for pattern in "${MVP_PATTERNS[@]}"; do
            check_content "$README_FILE" "$pattern"
        done
    fi
done

echo -e "\n${BLUE}🏆 6. PREPARACIÓN WORLDSKILLS${NC}"
echo "================================"

# Verificar elementos específicos de competencia
COMPETITION_ELEMENTS=("WorldSkills" "animaciones" "transforms" "transitions" "CSS")

for element in "${COMPETITION_ELEMENTS[@]}"; do
    if grep -r "$element" "$BASE_DIR" --exclude-dir=_backup_secciones_eliminadas >/dev/null 2>&1; then
        test_result 0 "Elemento de competencia encontrado: $element"
    else
        test_result 1 "Elemento de competencia faltante: $element"
    fi
done

echo -e "\n${BLUE}🧹 7. LIMPIEZA Y ORGANIZACIÓN${NC}"
echo "================================"

# Verificar que el backup existe pero las secciones principales están limpias
if [ -d "$BASE_DIR/_backup_secciones_eliminadas" ]; then
    test_result 0 "Directorio backup existe para secciones eliminadas"
    
    # Contar archivos en backup
    backup_count=$(find "$BASE_DIR/_backup_secciones_eliminadas" -type f | wc -l)
    if [ $backup_count -gt 0 ]; then
        test_result 0 "Backup contiene archivos movidos ($backup_count archivos)"
    else
        test_result 1 "Backup está vacío"
    fi
else
    test_result 1 "Directorio backup faltante"
fi

# Verificar que solo tenemos 4 secciones principales
main_sections=$(find "$BASE_DIR" -maxdepth 1 -type d -name "[0-9]*" | wc -l)
if [ $main_sections -eq 4 ]; then
    test_result 0 "Exactamente 4 secciones principales (optimizado para 6h)"
else
    test_result 1 "Número incorrecto de secciones: $main_sections (debe ser 4)"
fi

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
        echo -e "\n${GREEN}🎉 ¡EXCELENTE! Día 2 optimizado y listo para 6h de entrenamiento${NC}"
        echo -e "${GREEN}✅ Estructura limpia con solo 4 secciones esenciales${NC}"
        echo -e "${GREEN}✅ Timeboxing de 6 horas exactas${NC}"
        echo -e "${GREEN}✅ Metodología MVP aplicada${NC}"
        echo -e "${GREEN}✅ Contenido enfocado en lo esencial${NC}"
    elif [ $PERCENTAGE -ge 75 ]; then
        echo -e "\n${YELLOW}⚠️  BUENO - Día 2 funcional pero necesita ajustes menores${NC}"
    else
        echo -e "\n${RED}❌ REQUIERE TRABAJO - Día 2 necesita correcciones importantes${NC}"
    fi
else
    echo -e "\n${RED}❌ ERROR - No se pudieron ejecutar tests${NC}"
fi

echo -e "\n${BLUE}📊 ESTRUCTURA FINAL OPTIMIZADA${NC}"
echo "================================"
echo "✅ 01-css-animations-keyframes/ (1h 45min)"
echo "✅ 02-css-transforms-2d-3d/ (1h 45min)"
echo "✅ 03-css-transitions-timing/ (1h)"
echo "✅ 04-proyecto-final/ (45min)"
echo "🗑️ Secciones eliminadas: movidas a _backup_secciones_eliminadas/"

echo -e "\n${BLUE}🚀 PRÓXIMOS PASOS${NC}"
echo "=================="
echo "1. Ejecutar entrenamiento de 6 horas exactas"
echo "2. Validar con estudiantes reales"
echo "3. Proceder al Día 3: JavaScript ES6+ Esencial"

exit $FAILED_TESTS
