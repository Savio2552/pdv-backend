# Multi-Tenant Setup - PDV System

## Estrutura Criada

### Entities
- **Company**: Empresas/clientes (tenants)
- **User**: Usuários/operadores do PDV (vinculados a uma company)
- **Admin**: Administradores do sistema (você e sua equipe)
- **RefreshToken**: Tokens de refresh compartilhados

### Endpoints

#### Admin (Dashboard Admin)
- `POST /auth/admin/login` - Login de administrador
- `POST /auth/admin/refresh` - Renovar token admin
- `POST /auth/admin/logout` - Logout admin
- `POST /auth/admin/create` - Criar novo admin

#### Users (PDV App - Clientes)
- `POST /auth/login` - Login de usuário (valida company ativa)
- `POST /auth/refresh` - Renovar token user
- `POST /auth/logout` - Logout user
- `POST /auth/create-test-user` - Criar user teste (dev)

## Como Testar

### 1. Criar o primeiro Admin

```bash
curl -X POST http://localhost:3000/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pdv.com",
    "password": "admin123",
    "name": "Super Admin",
    "role": "super_admin"
  }'
```

### 2. Login Admin (Dashboard)

```bash
curl -X POST http://localhost:3000/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pdv.com",
    "password": "admin123"
  }'
```

### 3. Criar uma Company (manualmente no banco ou criar endpoint)

```sql
INSERT INTO companies (id, name, cnpj, plan, status, "monthlyFee", "createdAt", "updatedAt")
VALUES (
  'uuid-da-empresa', 
  'Empresa Teste', 
  '12345678000100', 
  'premium', 
  'active', 
  99.90,
  NOW(),
  NOW()
);
```

### 4. Criar um User vinculado à Company

```bash
curl -X POST http://localhost:3000/auth/create-test-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@empresa.com",
    "password": "senha123"
  }'
```

**Nota:** Depois de criar, atualize manualmente o `companyId` do user no banco.

### 5. Login User (PDV App)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@empresa.com",
    "password": "senha123"
  }'
```

## Diferenças nos Tokens

### Token Admin
```json
{
  "email": "admin@pdv.com",
  "sub": "admin-uuid",
  "role": "super_admin",
  "type": "admin"
}
```

### Token User
```json
{
  "email": "operador@empresa.com",
  "sub": "user-uuid",
  "role": "operator",
  "companyId": "company-uuid",
  "type": "user"
}
```

## Validações Implementadas

1. **User Login**: Valida se a company está ativa
2. **User Refresh**: Valida se a company continua ativa
3. **Admin**: Sem validação de company (acesso total)

## Próximos Passos

1. Criar endpoints CRUD de Companies no dashboard-admin
2. Criar endpoint para criar Users vinculados a uma Company
3. Implementar Guards para verificar `type` no token (admin vs user)
4. Criar tela de gerenciamento de empresas no dashboard
5. Adicionar billing/pagamento
