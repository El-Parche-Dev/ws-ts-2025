#!/bin/bash
# Validación del Día 7: React + Express Integration
# Tiempo límite: 6 horas (360 minutos)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

echo -e "${BOLD}${BLUE}🎯 VALIDACIÓN DÍA 7: React + Express Integration${NC}"
echo -e "${BLUE}⏰ Tiempo objetivo: 6 horas (360 minutos)${NC}"
echo -e "${BLUE}📅 $(date)${NC}"
echo "=================================================="

# Función para ejecutar test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_pattern="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -n "🧪 Test $TESTS_TOTAL: $test_name... "
    
    if eval "$command" | grep -q "$expected_pattern" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Función para verificar archivo existe
check_file() {
    local file_path="$1"
    local description="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -n "📁 Test $TESTS_TOTAL: $description... "
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ MISSING${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Función para verificar directorio existe
check_directory() {
    local dir_path="$1"
    local description="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -n "📂 Test $TESTS_TOTAL: $description... "
    
    if [ -d "$dir_path" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ MISSING${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Función para verificar contenido de archivo
check_content() {
    local file_path="$1"
    local pattern="$2"
    local description="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -n "🔍 Test $TESTS_TOTAL: $description... "
    
    if [ -f "$file_path" ] && grep -q "$pattern" "$file_path" 2>/dev/null; then
        echo -e "${GREEN}✅ FOUND${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ NOT FOUND${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Base directory
BASE_DIR="entrenamiento/dia-07-react-express"

echo -e "\n${YELLOW}SECCIÓN 1: Verificación de Estructura${NC}"
echo "=============================================="

# 01. Setup Full-Stack
check_directory "$BASE_DIR/01-setup-fullstack" "Directorio 01-setup-fullstack"
check_directory "$BASE_DIR/01-setup-fullstack/frontend" "Frontend setup"
check_directory "$BASE_DIR/01-setup-fullstack/backend" "Backend setup"
check_file "$BASE_DIR/01-setup-fullstack/README.md" "README sección 01"

# 02. React Express Communication
check_directory "$BASE_DIR/02-react-express-comm" "Directorio 02-react-express-comm"
check_directory "$BASE_DIR/02-react-express-comm/frontend" "Frontend communication"
check_directory "$BASE_DIR/02-react-express-comm/backend" "Backend communication"
check_file "$BASE_DIR/02-react-express-comm/README.md" "README sección 02"

# 03. CRUD Operations
check_directory "$BASE_DIR/03-crud-operations" "Directorio 03-crud-operations"
check_directory "$BASE_DIR/03-crud-operations/frontend" "Frontend CRUD"
check_directory "$BASE_DIR/03-crud-operations/backend" "Backend CRUD"
check_file "$BASE_DIR/03-crud-operations/README.md" "README sección 03"

# 04. State Management
check_directory "$BASE_DIR/04-state-management" "Directorio 04-state-management"
check_file "$BASE_DIR/04-state-management/README.md" "README sección 04"

# 05. MVP Todo Full-Stack
check_directory "$BASE_DIR/05-mvp-todo-fullstack" "Directorio 05-mvp-todo-fullstack"
check_file "$BASE_DIR/05-mvp-todo-fullstack/README.md" "README sección 05"

# 06. Enhanced Validation
check_directory "$BASE_DIR/06-enhanced-validation" "Directorio 06-enhanced-validation"
check_file "$BASE_DIR/06-enhanced-validation/README.md" "README sección 06"

# 07. Polish UX
check_directory "$BASE_DIR/07-polish-ux" "Directorio 07-polish-ux"
check_file "$BASE_DIR/07-polish-ux/README.md" "README sección 07"

echo -e "\n${YELLOW}SECCIÓN 2: Validación de Archivos React${NC}"
echo "=============================================="

# Frontend files sección 01
check_file "$BASE_DIR/01-setup-fullstack/frontend/src/App.jsx" "App.jsx setup"
check_file "$BASE_DIR/01-setup-fullstack/frontend/src/main.jsx" "main.jsx setup"
check_file "$BASE_DIR/01-setup-fullstack/frontend/package.json" "package.json frontend setup"
check_file "$BASE_DIR/01-setup-fullstack/frontend/vite.config.js" "vite.config.js setup"

# Frontend files sección 02
check_file "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "App.jsx communication"
check_file "$BASE_DIR/02-react-express-comm/frontend/src/App.css" "App.css communication"
check_file "$BASE_DIR/02-react-express-comm/frontend/package.json" "package.json communication"

# Frontend files sección 03 (CRUD)
check_file "$BASE_DIR/03-crud-operations/frontend/src/App.jsx" "App.jsx CRUD"
check_file "$BASE_DIR/03-crud-operations/frontend/src/App.css" "App.css CRUD"
check_file "$BASE_DIR/03-crud-operations/frontend/src/components/TaskForm.jsx" "TaskForm component"
check_file "$BASE_DIR/03-crud-operations/frontend/src/components/TaskList.jsx" "TaskList component"
check_file "$BASE_DIR/03-crud-operations/frontend/src/components/TaskItem.jsx" "TaskItem component"
check_file "$BASE_DIR/03-crud-operations/frontend/src/components/TaskStats.jsx" "TaskStats component"

echo -e "\n${YELLOW}SECCIÓN 3: Validación de Archivos Express${NC}"
echo "=============================================="

# Backend files sección 01
check_file "$BASE_DIR/01-setup-fullstack/backend/server.js" "server.js setup"
check_file "$BASE_DIR/01-setup-fullstack/backend/package.json" "package.json backend setup"

# Backend files sección 02
check_file "$BASE_DIR/02-react-express-comm/backend/server.js" "server.js communication"
check_file "$BASE_DIR/02-react-express-comm/backend/package.json" "package.json communication"

# Backend files sección 03
check_file "$BASE_DIR/03-crud-operations/backend/server.js" "server.js CRUD"

echo -e "\n${YELLOW}SECCIÓN 4: Validación de Contenido MVP${NC}"
echo "=============================================="

# Validar contenido de React Components
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "useState" "useState hook en comunicación"
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "useEffect" "useEffect hook en comunicación"
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "fetch" "fetch API en comunicación"

# Validar CRUD operations
check_content "$BASE_DIR/03-crud-operations/frontend/src/App.jsx" "createTask" "función createTask"
check_content "$BASE_DIR/03-crud-operations/frontend/src/App.jsx" "updateTask" "función updateTask"
check_content "$BASE_DIR/03-crud-operations/frontend/src/App.jsx" "deleteTask" "función deleteTask"

# Validar Express endpoints
check_content "$BASE_DIR/02-react-express-comm/backend/server.js" "app.get.*api.*users" "GET endpoint users"
check_content "$BASE_DIR/02-react-express-comm/backend/server.js" "app.post.*api.*users" "POST endpoint users"
check_content "$BASE_DIR/02-react-express-comm/backend/server.js" "cors" "CORS middleware"

# Validar CRUD endpoints
check_content "$BASE_DIR/03-crud-operations/backend/server.js" "app.get.*api.*tasks" "GET tasks endpoint"
check_content "$BASE_DIR/03-crud-operations/backend/server.js" "app.post.*api.*tasks" "POST tasks endpoint"
check_content "$BASE_DIR/03-crud-operations/backend/server.js" "app.put.*api.*tasks" "PUT tasks endpoint"
check_content "$BASE_DIR/03-crud-operations/backend/server.js" "app.delete.*api.*tasks" "DELETE tasks endpoint"

echo -e "\n${YELLOW}SECCIÓN 5: Validación de Configuración${NC}"
echo "=============================================="

# Verificar package.json dependencies
check_content "$BASE_DIR/02-react-express-comm/frontend/package.json" "react" "React dependency"
check_content "$BASE_DIR/02-react-express-comm/frontend/package.json" "vite" "Vite dependency"
check_content "$BASE_DIR/02-react-express-comm/backend/package.json" "express" "Express dependency"
check_content "$BASE_DIR/02-react-express-comm/backend/package.json" "cors" "CORS dependency"

# Verificar scripts
check_content "$BASE_DIR/02-react-express-comm/frontend/package.json" "\"dev\"" "npm dev script"
check_content "$BASE_DIR/02-react-express-comm/backend/package.json" "\"start\"" "npm start script"

echo -e "\n${YELLOW}SECCIÓN 6: Validación de Metodología MVP${NC}"
echo "=============================================="

# Verificar comentarios MVP en código
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "FASE CORE" "Comentarios FASE CORE"
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "FASE ENHANCED" "Comentarios FASE ENHANCED"
check_content "$BASE_DIR/03-crud-operations/frontend/src/App.jsx" "FASE CORE" "Comentarios MVP CRUD"

# Verificar timeboxing en README
check_content "$BASE_DIR/README.md" "TIMEBOXED" "Timeboxing en README principal"
check_content "$BASE_DIR/01-setup-fullstack/README.md" "30 min" "Timeboxing sección 01"
check_content "$BASE_DIR/02-react-express-comm/README.md" "60 min" "Timeboxing sección 02"

echo -e "\n${YELLOW}SECCIÓN 7: Validación WorldSkills${NC}"
echo "=============================================="

# Verificar elementos específicos de WorldSkills
check_content "$BASE_DIR/README.md" "WorldSkills" "Referencia WorldSkills"
check_content "$BASE_DIR/README.md" "12:00.*6:00" "Horario competencia"
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.css" "responsive" "CSS responsive"
check_content "$BASE_DIR/03-crud-operations/frontend/src/App.css" "@media" "Media queries"

# Verificar manejo de errores
check_content "$BASE_DIR/02-react-express-comm/frontend/src/App.jsx" "catch" "Error handling frontend"
check_content "$BASE_DIR/02-react-express-comm/backend/server.js" "try.*catch" "Error handling backend"

echo -e "\n${YELLOW}SECCIÓN 8: Validación de Componentes Avanzados${NC}"
echo "=============================================="

# Verificar componentes CRUD
check_content "$BASE_DIR/03-crud-operations/frontend/src/components/TaskForm.jsx" "useState" "useState en TaskForm"
check_content "$BASE_DIR/03-crud-operations/frontend/src/components/TaskForm.jsx" "onSubmit" "onSubmit en TaskForm"
check_content "$BASE_DIR/03-crud-operations/frontend/src/components/TaskList.jsx" "filter" "Filtros en TaskList"
check_content "$BASE_DIR/03-crud-operations/frontend/src/components/TaskStats.jsx" "completionRate" "Statistics en TaskStats"

echo -e "\n${YELLOW}SECCIÓN 9: Resumen de Validación${NC}"
echo "=============================================="

# Calcular porcentaje de éxito
if [ $TESTS_TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
else
    SUCCESS_RATE=0
fi

echo -e "📊 ${BOLD}RESUMEN DE TESTS:${NC}"
echo -e "   ✅ Tests pasados: ${GREEN}$TESTS_PASSED${NC}"
echo -e "   ❌ Tests fallidos: ${RED}$TESTS_FAILED${NC}"
echo -e "   📝 Total tests: ${BLUE}$TESTS_TOTAL${NC}"
echo -e "   📈 Tasa de éxito: ${BOLD}$SUCCESS_RATE%${NC}"

# Evaluación final
if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "\n🏆 ${GREEN}${BOLD}EXCELENTE! Día 7 completado exitosamente${NC}"
    echo -e "🎯 ${GREEN}Listo para competencia WorldSkills 2025${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "\n🥉 ${YELLOW}${BOLD}BUENO! Día 7 mayormente completado${NC}"
    echo -e "⚠️  ${YELLOW}Revisar tests fallidos antes de continuar${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 60 ]; then
    echo -e "\n⚠️  ${YELLOW}${BOLD}PARCIAL: Día 7 necesita trabajo adicional${NC}"
    echo -e "🔧 ${YELLOW}Completar tests fallidos y revisar implementación${NC}"
    exit 1
else
    echo -e "\n❌ ${RED}${BOLD}CRÍTICO: Día 7 requiere trabajo significativo${NC}"
    echo -e "🚨 ${RED}Revisar estructura y implementación completa${NC}"
    exit 1
fi
