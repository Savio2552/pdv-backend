# API de Empresas - Documentação

## Endpoints Criados

### Base URL
```
http://localhost:3000/companies
```

---

## 📊 **GET /companies/stats**
Retorna estatísticas das empresas

**Response:**
```json
{
  "total": 15,
  "active": 12,
  "inactive": 2,
  "suspended": 1,
  "totalRevenue": 15480.00,
  "mrr": 15480.00
}
```

---

## 📋 **GET /companies**
Lista todas as empresas

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Padaria do João",
    "cnpj": "12345678000100",
    "plan": "premium",
    "status": "active",
    "monthlyFee": 199.90,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "users": []
  }
]
```

---

## 🔍 **GET /companies/:id**
Busca uma empresa específica

**Params:**
- `id` (UUID)

**Response:**
```json
{
  "id": "uuid",
  "name": "Padaria do João",
  "cnpj": "12345678000100",
  "plan": "premium",
  "status": "active",
  "monthlyFee": 199.90,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "users": [
    {
      "id": "user-uuid",
      "email": "operador@padaria.com",
      "name": "João Silva",
      "role": "operator"
    }
  ]
}
```

**Errors:**
- `404` - Empresa não encontrada

---

## ➕ **POST /companies**
Cria uma nova empresa

**Body:**
```json
{
  "name": "Padaria do João",
  "cnpj": "12345678000100",
  "plan": "premium",
  "monthlyFee": 199.90,
  "status": "active"
}
```

**Campos:**
- `name` (string, obrigatório)
- `cnpj` (string, obrigatório, único)
- `plan` (enum: "basic" | "standard" | "premium", obrigatório)
- `monthlyFee` (number, obrigatório)
- `status` (enum: "active" | "inactive" | "suspended", opcional, default: "active")

**Response:**
```json
{
  "id": "uuid",
  "name": "Padaria do João",
  "cnpj": "12345678000100",
  "plan": "premium",
  "status": "active",
  "monthlyFee": 199.90,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errors:**
- `409` - CNPJ já cadastrado

---

## ✏️ **PATCH /companies/:id**
Atualiza uma empresa

**Params:**
- `id` (UUID)

**Body (todos os campos opcionais):**
```json
{
  "name": "Nova Padaria do João",
  "cnpj": "98765432000100",
  "plan": "standard",
  "monthlyFee": 149.90,
  "status": "suspended"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Nova Padaria do João",
  "cnpj": "98765432000100",
  "plan": "standard",
  "status": "suspended",
  "monthlyFee": 149.90,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

**Errors:**
- `404` - Empresa não encontrada
- `409` - CNPJ já cadastrado (ao tentar mudar para um CNPJ existente)

---

## ❌ **DELETE /companies/:id**
Deleta uma empresa

**Params:**
- `id` (UUID)

**Response:**
```
Status: 200 OK
(sem body)
```

**Errors:**
- `404` - Empresa não encontrada

---

## 📌 Planos Disponíveis

| Plano | Valor Sugerido |
|-------|----------------|
| basic | R$ 99,90 |
| standard | R$ 149,90 |
| premium | R$ 199,90 |

## 📌 Status Disponíveis

| Status | Descrição |
|--------|-----------|
| active | Empresa ativa, pode fazer login |
| inactive | Empresa inativa, não pode fazer login |
| suspended | Empresa suspensa (ex: falta de pagamento) |

---

## 🧪 Como Testar

### 1. Criar uma empresa
```bash
curl -X POST http://localhost:3000/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Padaria do João",
    "cnpj": "12345678000100",
    "plan": "premium",
    "monthlyFee": 199.90
  }'
```

### 2. Listar empresas
```bash
curl http://localhost:3000/companies
```

### 3. Ver estatísticas
```bash
curl http://localhost:3000/companies/stats
```

### 4. Buscar empresa específica
```bash
curl http://localhost:3000/companies/{id}
```

### 5. Atualizar empresa
```bash
curl -X PATCH http://localhost:3000/companies/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

### 6. Deletar empresa
```bash
curl -X DELETE http://localhost:3000/companies/{id}
```

---

## 🔐 Segurança

**TODO:** Adicionar guards de autenticação nos endpoints
- Apenas admins autenticados devem acessar estes endpoints
- Implementar `@UseGuards(JwtAuthGuard)` e verificar `type === 'admin'`

---

## 🎯 Próximos Passos

1. Adicionar validação com `class-validator`
2. Adicionar guards de autenticação
3. Adicionar paginação no `GET /companies`
4. Adicionar filtros (por status, plano, etc)
5. Adicionar soft delete (ao invés de deletar permanentemente)
