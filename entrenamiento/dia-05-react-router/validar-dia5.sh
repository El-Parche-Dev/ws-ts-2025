#!/bin/bash

# 🎯 Script de Validación Completa - Día 5 React Router
# WorldSkills 2025 Training

echo "🚀 Iniciando Validación Completa del Día 5 - React Router"
echo "========================================================"

# Variables
DIA5_PATH="/home/epti/Documentos/sena/ws-tw-2025/entrenamiento/dia-05-react-router"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para validar sección
validate_section() {
    local section_name=$1
    local section_path=$2
    
    echo ""
    echo "📋 Validando: $section_name"
    echo "----------------------------------------"
    
    # Verificar que existe la carpeta
    if [ ! -d "$section_path" ]; then
        echo "❌ FALLO: Carpeta $section_path no existe"
        ((FAILED_TESTS++))
        return 1
    fi
    
    # Verificar archivos clave
    local files_to_check=("src/App.jsx" "package.json")
    
    for file in "${files_to_check[@]}"; do
        ((TOTAL_TESTS++))
        if [ -f "$section_path/$file" ]; then
            echo "✅ $file existe"
            ((PASSED_TESTS++))
        else
            echo "❌ $file falta"
            ((FAILED_TESTS++))
        fi
    done
    
    # Verificar que App.jsx no está vacío
    ((TOTAL_TESTS++))
    if [ -s "$section_path/src/App.jsx" ]; then
        echo "✅ App.jsx tiene contenido"
        ((PASSED_TESTS++))
    else
        echo "❌ App.jsx está vacío"
        ((FAILED_TESTS++))
    fi
    
    # Verificar imports de React Router
    ((TOTAL_TESTS++))
    if grep -q "react-router-dom" "$section_path/src/App.jsx" 2>/dev/null; then
        echo "✅ React Router importado"
        ((PASSED_TESTS++))
    else
        echo "❌ React Router no importado"
        ((FAILED_TESTS++))
    fi
}

# Validar cada sección
validate_section "01. Router Básicos" "$DIA5_PATH/01-router-basicos"
validate_section "02. Rutas Dinámicas" "$DIA5_PATH/02-rutas-dinamicas"
validate_section "03. Auth Context" "$DIA5_PATH/03-auth-context"
validate_section "04. Layout System" "$DIA5_PATH/04-layout-system"
validate_section "05. Navegación Pro" "$DIA5_PATH/05-navegacion-pro"

# Validar documentación
echo ""
echo "📋 Validando Documentación"
echo "----------------------------------------"

docs_to_check=(
    "$DIA5_PATH/README.md"
    "$DIA5_PATH/06-integracion/README.md"
)

for doc in "${docs_to_check[@]}"; do
    ((TOTAL_TESTS++))
    if [ -f "$doc" ]; then
        echo "✅ $(basename $doc) existe"
        ((PASSED_TESTS++))
    else
        echo "❌ $(basename $doc) falta"
        ((FAILED_TESTS++))
    fi
done

# Verificar estructura de archivos críticos
echo ""
echo "📋 Validando Estructura Crítica"
echo "----------------------------------------"

critical_patterns=(
    "BrowserRouter\|Router"
    "Routes"
    "Route"
    "NavLink\|Link"
    "useNavigate\|useParams"
)

for section in "01-router-basicos" "02-rutas-dinamicas" "03-auth-context" "04-layout-system" "05-navegacion-pro"; do
    app_file="$DIA5_PATH/$section/src/App.jsx"
    if [ -f "$app_file" ]; then
        for pattern in "${critical_patterns[@]}"; do
            ((TOTAL_TESTS++))
            if grep -q "$pattern" "$app_file" 2>/dev/null; then
                echo "✅ $section: $pattern encontrado"
                ((PASSED_TESTS++))
            else
                echo "❌ $section: $pattern falta"
                ((FAILED_TESTS++))
            fi
        done
    fi
done

# Resumen final
echo ""
echo "🎯 RESUMEN DE VALIDACIÓN"
echo "========================================================"
echo "Total de tests: $TOTAL_TESTS"
echo "Tests pasados: $PASSED_TESTS"
echo "Tests fallidos: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo "🏆 ¡VALIDACIÓN EXITOSA!"
    echo "✅ Día 5 completado correctamente"
    echo "✅ Todas las secciones implementadas"
    echo "✅ React Router configurado en todas las secciones"
    echo "✅ Documentación completa"
    echo ""
    echo "🚀 ¡Listo para competencia WorldSkills 2025!"
    exit 0
else
    echo ""
    echo "⚠️  VALIDACIÓN CON ERRORES"
    echo "❌ Se encontraron $FAILED_TESTS problemas"
    echo "📝 Revisar los elementos marcados arriba"
    echo ""
    echo "🔧 Corregir y volver a ejecutar la validación"
    exit 1
fi
