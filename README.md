# Launcher Dynamic Items (Reports)

Repositório centralizado para gerenciamento de itens dinâmicos de menu reports da aplicação Launcher. Este projeto permite adicionar, modificar e remover itens de menu sem necessidade de deploy da aplicação principal.

Este repositório armazena configurações de menus em formato JSON que são consumidas dinamicamente pela aplicação principal. Cada arquivo JSON contém:

- **version**: Versionamento semântico (atualizado automaticamente)
- **lastUpdate**: Timestamp da última modificação (atualizado automaticamente)
- **items**: Array de itens de menu com suas configurações

### Funcionalidades Principais

- Versionamento semântico **automático** baseado em commits
- Validação de schema e estrutura JSON
- Validação de mensagens de commit
- Formatação automática de código com Prettier
- CI/CD com GitHub Actions

---

## Pré-requisitos

- **Node.js**: >= 22.0.0
- **npm**: >= 9.0.0
- **Git**: Qualquer versão recente

---

## Como Utilizar

### 1. Clone o repositório (primeira vez)

```bash
git clone <repository-url>
cd launcher-dynamic-items
```

**Se já tiver o projeto clonado, pule para o passo 2.**

### 2. Atualize a branch develop

**Antes de criar uma nova branch, sempre atualize a develop:**

```bash
# Mude para a branch develop
git checkout develop

# Baixe as últimas alterações
git pull origin develop
```

### 3. Crie nova branch a partir da develop

```bash
git checkout -b feature/nome-da-branch
```

### 4. Instale as dependências

```bash
npm install
```

Este comando irá:

- Instalar todas as dependências (ajv, prettier, chalk, glob)
- Configurar hooks do Git automaticamente (pre-commit e commit-msg)

---

### Adicionar Novo Item a um Menu Existente

1. Abra o arquivo JSON correspondente em `menu-configs/`:
   - `analytics.json` - Para relatórios e analytics
   - `custom.json` - Para itens customizados

2. Adicione o novo item no array `items`:

```json
{
  "id": "analytics-new-item",
  "key": "reports-new-item",
  "labelKey": "menu.reports.analytics.newitem",
  "translations": {
    "pt-br": "Novo Relatório",
    "en": "New Report",
    "es": "Nuevo Informe"
  },
  "rules": [["REPORT_READ", "REPORT_WRITE"]],
  "dashboardId": "uuid do dashboard"
}
```

3. Valide localmente:

```bash
npm test
```

4. Faça o commit:

```bash
git add menu-configs/analytics.json
git commit -m "feat: Descrição do commit ..."
```

### Criar Novo Arquivo de Menu

1. Crie um novo arquivo em `menu-configs/`:

```bash
touch menu-configs/reports.json
```

2. Adicione a estrutura base:

```json
{
  "version": "1.0.0",
  "lastUpdate": "2025-10-24T00:00:00Z",
  "items": []
}
```

3. Adicione seus itens e valide:

```bash
npm test
```

4. Faça o commit com scope:

```bash
git add menu-configs/reports.json
git commit -m "feat(reports): Descrição do commit ..."
```

---

## Versionamento Semântico

Este projeto usa **versionamento semântico automático**. Os campos `version` e `lastUpdate` são atualizados automaticamente baseados no tipo de commit.

### Tipos de Commit e Versionamento

| Commit         | Bump      | Exemplo           | Quando Usar                 |
| -------------- | --------- | ----------------- | --------------------------- |
| `feat(scope):` | **MAJOR** | 1.5.3 → **2.0.0** | Novo arquivo JSON           |
| `feat:`        | **MINOR** | 1.5.3 → **1.6.0** | Adição em arquivo existente |
| `fix:`         | **PATCH** | 1.5.3 → **1.5.4** | Correção de bug/erro        |

### Como Funciona

```
1. Você faz commit: "feat: adicionar novo menu ..."
2. Push e merge para develop
3. GitHub Action analisa o commit
4. Detecta "feat:" → MINOR bump
5. Atualiza automaticamente:
   - version: 1.5.3 → 1.6.0
   - lastUpdate: timestamp atual
6. Faz commit automático das mudanças
7. Pronto! ✓
```

**IMPORTANTE:** Você **NÃO deve** editar manualmente os campos `version` e `lastUpdate`!

---

## Como Commitar

### Prefixos Obrigatórios

**TODOS** os commits devem usar um destes 3 prefixos:

#### 1. `feat(scope):` - Novo Arquivo (MAJOR)

```bash
# Criar novo arquivo menu-configs/dashboard.json
git commit -m "feat(dashboard): criar arquivo de menus de dashboard"

# Resultado: version 1.5.3 → 2.0.0
```

#### 2. `feat:` - Adição em Existente (MINOR)

```bash
# Adicionar item em menu-configs/analytics.json
git commit -m "feat: adicionar dashboard de vendas ao menu analytics"

# Resultado: version 1.5.3 → 1.6.0
```

#### 3. `fix:` - Correção (PATCH)

```bash
# Corrigir tradução ou link
git commit -m "fix: corrigir URL do dashboard de clientes"

# Resultado: version 1.5.3 → 1.5.4
```

### Formatação Automática

Antes de cada commit, o código é **formatado automaticamente** com Prettier:

```bash
git commit -m "feat: xyz"

# Hook formata automaticamente:
# ✓ Formatting code with Prettier...
# ✓ Code formatted successfully!
# ✓ Commit criado
```

---

## Validações

O projeto possui múltiplas camadas de validação:

### 1. Validação de Schema (JSON Schema)

Verifica:

- Campos obrigatórios existem
- Tipos de dados corretos
- Formatos válidos (UUID, date-time, etc)
- Padrões regex (IDs, permissões, etc)

### 2. Validação de Commits

Verifica:

- Mensagem usa prefixo obrigatório (`feat(scope):`, `feat:`, `fix:`)
- Formato correto

### 4. Validação de Formatação

Verifica:

- Código formatado com Prettier
- Indentação consistente
- Aspas simples
