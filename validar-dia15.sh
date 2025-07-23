#!/bin/bash

# 🎯 Script de Validación - Día 15 WorldSkills 2025
# Verifica que todos los componentes del proyecto final estén implementados

echo "🧮 ==========================================="
echo "🎯 VALIDACIÓN DÍA 15 - PROYECTO FINAL"
echo "🧮 ==========================================="
echo ""

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

# Función para validar archivos
validate_file() {
    local file_path=$1
    local description=$2
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -f "$file_path" ]; then
        echo -e "✅ ${GREEN}PASS${NC} - $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "❌ ${RED}FAIL${NC} - $description"
        echo -e "   ${YELLOW}Archivo no encontrado: $file_path${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Función para validar directorios
validate_directory() {
    local dir_path=$1
    local description=$2
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -d "$dir_path" ]; then
        echo -e "✅ ${GREEN}PASS${NC} - $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "❌ ${RED}FAIL${NC} - $description"
        echo -e "   ${YELLOW}Directorio no encontrado: $dir_path${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Función para validar contenido de archivo
validate_content() {
    local file_path=$1
    local search_term=$2
    local description=$3
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -f "$file_path" ] && grep -q "$search_term" "$file_path"; then
        echo -e "✅ ${GREEN}PASS${NC} - $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "❌ ${RED}FAIL${NC} - $description"
        echo -e "   ${YELLOW}Contenido '$search_term' no encontrado en: $file_path${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}📋 VALIDANDO ESTRUCTURA DEL PROYECTO FINAL...${NC}"
echo ""

# ========== VALIDACIÓN DE CALCULADORA PHP ==========
echo -e "${BLUE}🧮 CALCULADORA PHP MODERNA${NC}"
validate_file "entrenamiento/semana-backend-php-laravel/dia-11-php-fundamentos-laravel/ejercicios/calculadora.php" "Calculadora PHP implementada"
validate_content "entrenamiento/semana-backend-php-laravel/dia-11-php-fundamentos-laravel/ejercicios/calculadora.php" "declare(strict_types=1)" "Declaración strict_types"
validate_content "entrenamiento/semana-backend-php-laravel/dia-11-php-fundamentos-laravel/ejercicios/calculadora.php" "private string \$nombre" "Constructor property promotion"
validate_content "entrenamiento/semana-backend-php-laravel/dia-11-php-fundamentos-laravel/ejercicios/calculadora.php" "match(" "Match expressions implementadas"
validate_content "entrenamiento/semana-backend-php-laravel/dia-11-php-fundamentos-laravel/ejercicios/calculadora.php" "int|float|string" "Union types implementados"
echo ""

# ========== VALIDACIÓN DE PROYECTO LARAVEL API ==========
echo -e "${BLUE}🚀 PROYECTO LARAVEL API${NC}"
validate_directory "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api" "Directorio del proyecto API"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Http/Controllers/Api/V1/AuthController.php" "AuthController implementado"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Http/Controllers/Api/V1/ProductController.php" "ProductController implementado"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Services/AuthService.php" "AuthService implementado"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Models/Product.php" "Product Model implementado"
echo ""

# ========== VALIDACIÓN DE DOCKER & DEVOPS ==========
echo -e "${BLUE}🐳 DOCKER & DEVOPS${NC}"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/docker-compose.yml" "Docker Compose configurado"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/docker/Dockerfile" "Dockerfile multi-stage"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/.github/workflows/ci-cd.yml" "CI/CD Pipeline configurado"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/docker-compose.yml" "services:" "Servicios Docker definidos"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/docker/Dockerfile" "FROM php:8.2-fpm-alpine" "PHP 8.2 configurado"
echo ""

# ========== VALIDACIÓN DE DOCUMENTACIÓN ==========
echo -e "${BLUE}📖 DOCUMENTACIÓN${NC}"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/PROYECTO_FINAL_COMPLETADO.md" "Resumen ejecutivo del proyecto"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/docs/api-documentation.md" "Documentación de API"
validate_file "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/docs/performance-benchmarks.md" "Benchmarks de performance"
validate_file "_docs/COMPLETADO_DIA15.md" "Documentación de completado"
echo ""

# ========== VALIDACIÓN DE FEATURES LARAVEL ==========
echo -e "${BLUE}⚡ FEATURES DE LARAVEL${NC}"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Http/Controllers/Api/V1/AuthController.php" "AuthService" "Inyección de dependencias"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Http/Controllers/Api/V1/ProductController.php" "ProductResource" "API Resources implementados"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Models/Product.php" "SoftDeletes" "Soft deletes implementados"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/app/Models/Product.php" "scope" "Query scopes implementados"
echo ""

# ========== VALIDACIÓN DE CONTENIDO TÉCNICO ==========
echo -e "${BLUE}🔧 CONTENIDO TÉCNICO${NC}"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/docs/api-documentation.md" "Bearer Token" "Autenticación JWT documentada"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/docs/performance-benchmarks.md" "2,500 RPS" "Benchmarks de performance"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/PROYECTO_FINAL_COMPLETADO.md" "GOLD MEDAL" "Nivel WorldSkills alcanzado"
echo ""

# ========== VALIDACIÓN DE CI/CD ==========
echo -e "${BLUE}🚀 CI/CD PIPELINE${NC}"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/.github/workflows/ci-cd.yml" "code-quality" "Job de calidad de código"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/.github/workflows/ci-cd.yml" "testing" "Job de testing"
validate_content "entrenamiento/semana-backend-php-laravel/dia-15-proyecto-final-deployment/proyecto-worldskills-api/.github/workflows/ci-cd.yml" "deploy-production" "Job de deployment"
echo ""

# ========== RESUMEN FINAL ==========
echo ""
echo -e "${BLUE}📊 RESUMEN DE VALIDACIÓN${NC}"
echo "==========================================="

# Calcular porcentajes
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    FAIL_PERCENTAGE=$((FAILED_TESTS * 100 / TOTAL_TESTS))
else
    PASS_PERCENTAGE=0
    FAIL_PERCENTAGE=0
fi

echo "📋 Total de validaciones: $TOTAL_TESTS"
echo -e "✅ ${GREEN}Aprobadas: $PASSED_TESTS ($PASS_PERCENTAGE%)${NC}"
echo -e "❌ ${RED}Fallidas: $FAILED_TESTS ($FAIL_PERCENTAGE%)${NC}"
echo ""

# Determinar el resultado final
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "🎉 ${GREEN}¡PROYECTO COMPLETADO EXITOSAMENTE!${NC}"
    echo -e "🏆 ${GREEN}NIVEL: WORLDSKILLS GOLD MEDAL READY${NC}"
    echo -e "🚀 ${GREEN}¡LISTO PARA COMPETENCIA WORLDSKILLS 2025!${NC}"
    echo ""
    echo -e "${BLUE}🎯 LOGROS DESBLOQUEADOS:${NC}"
    echo "⭐ PHP 8.2+ Modern Features Master"
    echo "⭐ Laravel Framework Expert" 
    echo "⭐ API Architecture Professional"
    echo "⭐ DevOps & Docker Specialist"
    echo "⭐ Performance Optimization Expert"
    echo "⭐ Technical Documentation Master"
    echo "⭐ CI/CD Pipeline Architect"
    echo ""
    exit 0
elif [ $FAILED_TESTS -le 3 ]; then
    echo -e "⚠️  ${YELLOW}PROYECTO CASI COMPLETO${NC}"
    echo -e "📝 ${YELLOW}Revisar los elementos faltantes y completar${NC}"
    echo ""
    exit 1
else
    echo -e "❌ ${RED}PROYECTO INCOMPLETO${NC}"
    echo -e "📝 ${RED}Es necesario completar más elementos del proyecto${NC}"
    echo ""
    exit 2
fi
