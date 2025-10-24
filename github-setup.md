### Permissao de escrita para bot do github - Para conseguir fazer commits

1. **Acesse o Repositório** no GitHub

2. **Vá em Settings** (Configurações)

3. **Navegue até Actions**

4. **Configure Workflow Permissions**

5. **Selecione:**
   - **Read and write permissions**
   - **Allow GitHub Actions to create and approve pull requests**

6. **Salve:**
   - Clique em **"Save"** no final da página

---

### Configurar Branch Protection Rules - Para garantir que apenas código validade seja mergeado

1. **Acesse Settings → Branches**

2. **Clique em "Add branch protection rule"** ou edite a regra existente

3. **Configure:**

   **a) Branch name pattern:**

   ```
   develop
   ```

   **b) Marque as seguintes opções:**

   #### Require a pull request before merging
   - Impede commits diretos na `develop`
   - Força uso de Pull Requests

   #### Require status checks to pass before merging
   - Garante que validações passem antes do merge
   - **Sub-opção:** Require branches to be up to date before merging

   **Adicione os seguintes status checks:**
   - `Validate Menu Structure` (nome do job no workflow)

   #### Do not allow bypassing the above settings
   - Nem admins podem pular as proteções
   - Garante consistência total

4. **Salve:**
   - Role até o final e clique em **"Create"** ou **"Save changes"**

### Resultado:

Com estas proteções:

- Não é possível fazer push direto para `develop`
- Não é possível mergear PR com validações falhando
- Todo código passa por review e validação
