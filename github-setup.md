## Configurações

**É IMPORTANTE seguir esta ordem:**

1. Primeiro: Workflow Permissions (permite commits)
2. Segundo: PAT Token (permite bypass de proteções)
3. Terceiro: Branch Protection (protege a branch)
4. Quarto: Verificação e teste

---

### 1. Permissão de Escrita para Bot do GitHub

Para permitir que o GitHub Actions faça commits automaticamente:

1. **Acesse o Repositório** no GitHub

2. **Vá em Settings** (Configurações)

3. **Navegue até Actions → General**

4. **Role até "Workflow permissions"**

5. **Selecione:**
   - **Read and write permissions**
   - **Allow GitHub Actions to create and approve pull requests**

6. **Salve:**
   - Clique em **"Save"** no final da página

---

### 2. Criar Personal Access Token (PAT_TOKEN) - OBRIGATÓRIO

O PAT_TOKEN é necessário para que o bot consiga fazer push mesmo com Branch Protection ativa.

#### Passo 1: Criar o Token

1. **Acesse:** https://github.com/settings/tokens/new
   - Ou: Seu perfil → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Configure o Token:**

   ```
   Note: Launcher Dynamic Items Bot
   Expiration: 90 days (ou No expiration)
   ```

3. **Selecione as Permissões (TODAS obrigatórias):**

   ```
   repo (marque TODOS os sub-items)
      repo:status
      repo_deployment
      public_repo
      repo:invite
      security_events

   workflow
   ```

4. **Clique em "Generate token"**

5. **COPIE O TOKEN AGORA** (você só verá uma vez!)
   - Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Passo 2: Adicionar Token como Secret

1. **Acesse o repositório do launcher-dynamic-item:**

   ```
   https://github.com/[seu-usuario]/launcher-dynamic-items
   ```

2. **Vá em:** Settings → Secrets and variables → Actions

3. **Clique em:** "New repository secret"

4. **Configure:**

   ```
   Name: PAT_TOKEN
   Secret: [Cole o token que você copiou]
   ```

5. **Clique em:** "Add secret"

#### Passo 3: Verificar se Funcionou

O secret `PAT_TOKEN` deve aparecer na lista com um ícone de check verde.

---

### 3. Configurar Branch Protection Rules

Para garantir que apenas código validado seja mergeado na branch `develop`:

#### Passo 1: Acessar Configurações

1. **Acesse Settings → Branches**

2. **Clique em "Add branch protection rule"** (ou edite a regra existente)

#### Passo 2: Configurar a Regra

**Branch name pattern:**

```
develop
```

**Marque as seguintes opções:**

##### Require a pull request before merging

- Impede commits diretos na `develop`
- Força uso de Pull Requests
- **Opcional:** Require approvals (1 ou mais)

##### Require status checks to pass before merging

- Garante que validações passem antes do merge
- **Sub-opção:** Require branches to be up to date before merging

**Adicione o status check obrigatório:**

- `Validate Menu Structure` (digite e selecione)

##### Do not allow bypassing the above settings

- Nem admins podem pular as proteções
- Garante consistência total

#### Passo 3: Salvar

- Role até o final e clique em **"Create"** ou **"Save changes"**

#### Importante:

O status check `Validate Menu Structure` só aparece para selecionar **APÓS** o workflow ter rodado pelo menos uma vez. Se não aparecer:

1. Faça um PR de teste primeiro
2. Aguarde o workflow executar
3. Volte e adicione o status check

---

### Resultado Esperado

Com todas as configurações corretas:

**Validação Automática:**

- Todo PR é validado automaticamente
- PRs com erros são bloqueados
- Apenas código válido entra na `develop`

**Versionamento Automático:**

- Após merge, version é atualizada automaticamente
- lastUpdate recebe timestamp atual
- Commit automático é criado

**Proteção da Branch:**

- Não é possível fazer push direto para `develop`
- Não é possível mergear PR com validações falhando
- Todo código passa por review e validação
