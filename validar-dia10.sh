#!/bin/bash

# ===================================================================
# VALIDADOR DÍA 10: RESOLUCIÓN DE PROBLEMAS DE ALGORITMIA
# Verifica estructura, archivos y contenido del entrenamiento
# ===================================================================

echo "🧩 VALIDANDO DÍA 10: RESOLUCIÓN DE PROBLEMAS DE ALGORITMIA"
echo "============================================================"

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

# Función para validar archivo
check_file() {
    local file_path="$1"
    local description="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file_path" ]; then
        echo -e "✅ ${GREEN}PASS${NC}: $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "❌ ${RED}FAIL${NC}: $description"
        echo -e "   ${YELLOW}Archivo faltante: $file_path${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Función para validar directorio
check_dir() {
    local dir_path="$1"
    local description="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir_path" ]; then
        echo -e "✅ ${GREEN}PASS${NC}: $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "❌ ${RED}FAIL${NC}: $description"
        echo -e "   ${YELLOW}Directorio faltante: $dir_path${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Función para validar contenido de archivo
check_content() {
    local file_path="$1"
    local pattern="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file_path" ] && grep -q "$pattern" "$file_path"; then
        echo -e "✅ ${GREEN}PASS${NC}: $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "❌ ${RED}FAIL${NC}: $description"
        if [ ! -f "$file_path" ]; then
            echo -e "   ${YELLOW}Archivo no existe: $file_path${NC}"
        else
            echo -e "   ${YELLOW}Patrón no encontrado: $pattern${NC}"
        fi
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Función para contar archivos en directorio
count_files() {
    local dir_path="$1"
    local expected="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir_path" ]; then
        local count=$(find "$dir_path" -maxdepth 1 -type d | wc -l)
        count=$((count - 1)) # Resta el directorio padre
        
        if [ "$count" -ge "$expected" ]; then
            echo -e "✅ ${GREEN}PASS${NC}: $description ($count/$expected ejercicios)"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            echo -e "❌ ${RED}FAIL${NC}: $description ($count/$expected ejercicios)"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
    else
        echo -e "❌ ${RED}FAIL${NC}: $description (directorio no existe)"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Definir rutas base
BASE_DIR="entrenamiento/dia-10-resolucion-de-problemas"

echo -e "\n${BLUE}📁 VALIDANDO ESTRUCTURA PRINCIPAL${NC}"
echo "-----------------------------------"

# Estructura principal
check_dir "$BASE_DIR" "Directorio principal Día 10"
check_file "$BASE_DIR/README.md" "README principal del día"
check_dir "$BASE_DIR/00-estrategias-generales" "Carpeta de estrategias generales"
check_dir "$BASE_DIR/01-10-fundamentos-guiados" "Carpeta ejercicios 1-10"
check_dir "$BASE_DIR/11-30-practica-supervisada" "Carpeta ejercicios 11-30"
check_dir "$BASE_DIR/31-50-desafio-autonomo" "Carpeta ejercicios 31-50"
check_dir "$BASE_DIR/evaluacion" "Carpeta de evaluación"
check_dir "$BASE_DIR/herramientas" "Carpeta de herramientas"

echo -e "\n${BLUE}📋 VALIDANDO CONTENIDO DEL README PRINCIPAL${NC}"
echo "--------------------------------------------"

# Contenido del README principal
check_content "$BASE_DIR/README.md" "Día 10: Resolución de Problemas" "Título del día correcto"
check_content "$BASE_DIR/README.md" "CRONOGRAMA DETALLADO" "Cronograma incluido"
check_content "$BASE_DIR/README.md" "ESTRUCTURA DE DIFICULTAD" "Estructura de dificultad explicada"
check_content "$BASE_DIR/README.md" "WorldSkills" "Orientación WorldSkills"
check_content "$BASE_DIR/README.md" "MVP" "Metodología MVP incluida"

echo -e "\n${BLUE}🎯 VALIDANDO ESTRATEGIAS GENERALES${NC}"
echo "------------------------------------"

# Estrategias generales
check_file "$BASE_DIR/00-estrategias-generales/README.md" "README de estrategias generales"
check_content "$BASE_DIR/00-estrategias-generales/README.md" "METODOLOGÍA" "Metodología de resolución"
check_content "$BASE_DIR/00-estrategias-generales/README.md" "ANÁLISIS" "Framework de análisis"

echo -e "\n${BLUE}🌟 VALIDANDO EJERCICIOS 1-10 (FUNDAMENTOS)${NC}"
echo "--------------------------------------------"

# Ejercicios fundamentales específicos
exercises_1_10=(
    "ejercicio-01-suma-array"
    "ejercicio-02-numero-par"
    "ejercicio-03-convertidor-temperatura"
    "ejercicio-04-contador-vocales"
    "ejercicio-05-inversor-cadenas"
    "ejercicio-06-palindromo-detector"
    "ejercicio-07-calculadora-promedio"
    "ejercicio-08-contador-palabras"
    "ejercicio-09-generador-primos"
    "ejercicio-10-factorial"
)

for exercise in "${exercises_1_10[@]}"; do
    check_dir "$BASE_DIR/01-10-fundamentos-guiados/$exercise" "Ejercicio $exercise existe"
    check_file "$BASE_DIR/01-10-fundamentos-guiados/$exercise/README.md" "README del $exercise"
    
    # Validar contenido específico de ejercicios guiados
    if [ -f "$BASE_DIR/01-10-fundamentos-guiados/$exercise/README.md" ]; then
        check_content "$BASE_DIR/01-10-fundamentos-guiados/$exercise/README.md" "FASE CORE" "Metodología MVP - Fase Core"
        check_content "$BASE_DIR/01-10-fundamentos-guiados/$exercise/README.md" "ANÁLISIS PASO A PASO" "Análisis paso a paso incluido"
        check_content "$BASE_DIR/01-10-fundamentos-guiados/$exercise/README.md" "CONCEPTOS CLAVE" "Conceptos clave explicados"
    fi
done

echo -e "\n${BLUE}⚡ VALIDANDO EJERCICIOS 11-30 (PRÁCTICA)${NC}"
echo "-------------------------------------------"

# Verificar que existen ejercicios de práctica
count_files "$BASE_DIR/11-30-practica-supervisada" 5 "Mínimo 5 ejercicios de práctica"

# Validar algunos ejercicios específicos
practice_exercises=(
    "ejercicio-11-array-maximo"
    "ejercicio-12-filtrar-pares"
    "ejercicio-13-capitalizar-palabras"
    "ejercicio-14-remover-duplicados"
    "ejercicio-15-buscar-elemento"
)

for exercise in "${practice_exercises[@]}"; do
    if [ -d "$BASE_DIR/11-30-practica-supervisada/$exercise" ]; then
        check_file "$BASE_DIR/11-30-practica-supervisada/$exercise/README.md" "README del $exercise"
        check_content "$BASE_DIR/11-30-practica-supervisada/$exercise/README.md" "Tiempo límite" "Timeboxing definido"
    fi
done

echo -e "\n${BLUE}🏆 VALIDANDO EJERCICIOS 31-50 (DESAFÍO)${NC}"
echo "-------------------------------------------"

# Verificar ejercicios de desafío
count_files "$BASE_DIR/31-50-desafio-autonomo" 3 "Mínimo 3 ejercicios de desafío"

# Validar ejercicios específicos de desafío
challenge_exercises=(
    "ejercicio-31-fibonacci-recursivo"
    "ejercicio-46-quicksort"
    "ejercicio-50-sistema-tareas-final"
)

for exercise in "${challenge_exercises[@]}"; do
    if [ -d "$BASE_DIR/31-50-desafio-autonomo/$exercise" ]; then
        check_file "$BASE_DIR/31-50-desafio-autonomo/$exercise/README.md" "README del $exercise"
        check_content "$BASE_DIR/31-50-desafio-autonomo/$exercise/README.md" "Avanzado" "Nivel avanzado marcado"
        check_content "$BASE_DIR/31-50-desafio-autonomo/$exercise/README.md" "WorldSkills" "Orientación WorldSkills"
    fi
done

echo -e "\n${BLUE}📊 VALIDANDO SISTEMA DE EVALUACIÓN${NC}"
echo "-------------------------------------"

# Sistema de evaluación
check_file "$BASE_DIR/evaluacion/README.md" "README del sistema de evaluación"
check_content "$BASE_DIR/evaluacion/README.md" "RÚBRICAS" "Rúbricas de evaluación"
check_content "$BASE_DIR/evaluacion/README.md" "WORLDSKILLS" "Sistema de calificación WorldSkills"
check_content "$BASE_DIR/evaluacion/README.md" "MÉTRICAS" "Métricas de progreso"

echo -e "\n${BLUE}🔧 VALIDANDO HERRAMIENTAS${NC}"
echo "----------------------------"

# Herramientas de desarrollo
check_file "$BASE_DIR/herramientas/README.md" "README de herramientas"
check_content "$BASE_DIR/herramientas/README.md" "TEST RUNNER" "Test runner automático"
check_content "$BASE_DIR/herramientas/README.md" "PERFORMANCE" "Analizador de rendimiento"
check_content "$BASE_DIR/herramientas/README.md" "VALIDADOR" "Validador de soluciones"

echo -e "\n${BLUE}🎯 VALIDANDO METODOLOGÍA MVP${NC}"
echo "--------------------------------"

# Verificar implementación de metodología MVP
mvp_files=(
    "$BASE_DIR/README.md"
    "$BASE_DIR/01-10-fundamentos-guiados/ejercicio-01-suma-array/README.md"
    "$BASE_DIR/01-10-fundamentos-guiados/ejercicio-02-numero-par/README.md"
)

for file in "${mvp_files[@]}"; do
    if [ -f "$file" ]; then
        check_content "$file" "FASE CORE" "Metodología MVP - Fase Core implementada"
        check_content "$file" "Tiempo estimado" "Timeboxing implementado"
    fi
done

echo -e "\n${BLUE}📈 VALIDANDO PROGRESIÓN DE DIFICULTAD${NC}"
echo "---------------------------------------"

# Verificar que hay progresión de dificultad
difficulty_markers=(
    "⭐ Básico"
    "⭐⭐⭐ Intermedio"
    "⭐⭐⭐⭐ Avanzado"
    "🏆 Experto"
)

for marker in "${difficulty_markers[@]}"; do
    if grep -r "$marker" "$BASE_DIR" > /dev/null 2>&1; then
        echo -e "✅ ${GREEN}PASS${NC}: Nivel '$marker' encontrado"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "❌ ${RED}FAIL${NC}: Nivel '$marker' no encontrado"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
done

# ===================================================================
# REPORTE FINAL
# ===================================================================

echo -e "\n${BLUE}📋 REPORTE FINAL DE VALIDACIÓN${NC}"
echo "=================================="

SUCCESS_RATE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

echo -e "✅ Tests exitosos: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "❌ Tests fallidos: ${RED}$FAILED_CHECKS${NC}"
echo -e "📊 Total de tests: $TOTAL_CHECKS"
echo -e "📈 Tasa de éxito: ${GREEN}$SUCCESS_RATE%${NC}"

if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "\n🏆 ${GREEN}EXCELENTE${NC}: Día 10 implementado correctamente"
    echo -e "   ¡Listo para entrenamiento WorldSkills!"
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "\n🥈 ${YELLOW}BUENO${NC}: Implementación sólida con mejoras menores"
    echo -e "   Revisar elementos faltantes antes del entrenamiento"
elif [ $SUCCESS_RATE -ge 70 ]; then
    echo -e "\n🥉 ${YELLOW}ACEPTABLE${NC}: Estructura básica completa"
    echo -e "   Completar elementos faltantes antes del entrenamiento"
else
    echo -e "\n❌ ${RED}REQUIERE TRABAJO${NC}: Implementación incompleta"
    echo -e "   Completar elementos críticos antes de continuar"
fi

echo -e "\n💡 ${BLUE}Sugerencias:${NC}"

if [ $FAILED_CHECKS -gt 0 ]; then
    echo -e "   • Revisar elementos marcados como FAIL"
    echo -e "   • Completar archivos README faltantes"
    echo -e "   • Verificar contenido de metodología MVP"
fi

echo -e "   • Ejecutar tests con las herramientas incluidas"
echo -e "   • Validar que los ejercicios funcionan correctamente"
echo -e "   • Preparar datos de prueba para entrenamiento"

echo -e "\n🎯 ${GREEN}¡Día 10 de Resolución de Problemas validado!${NC}"

# Guardar reporte en archivo
{
    echo "REPORTE DE VALIDACIÓN - DÍA 10"
    echo "==============================="
    echo "Fecha: $(date)"
    echo "Tests exitosos: $PASSED_CHECKS"
    echo "Tests fallidos: $FAILED_CHECKS"
    echo "Total: $TOTAL_CHECKS"
    echo "Tasa de éxito: $SUCCESS_RATE%"
} > "$BASE_DIR/reporte-validacion.txt"

echo -e "\n📄 Reporte guardado en: ${BLUE}$BASE_DIR/reporte-validacion.txt${NC}"

# Exit code basado en el resultado
if [ $SUCCESS_RATE -ge 80 ]; then
    exit 0
else
    exit 1
fi
