# 🛍️ Marketplace App

Aplicativo de marketplace desenvolvido com React Native, Expo e TypeScript.

## 📋 Índice

- [Características](#-características)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Integração com API](#-integração-com-api)
- [Personalização de Cores](#-personalização-de-cores)
- [Componentes](#-componentes)
- [Tecnologias](#-tecnologias)

## ✨ Características

- ✅ **Sistema de temas** (Light/Dark mode)
- ✅ **Integração com API REST** backend
- ✅ **Autenticação JWT** com AsyncStorage
- ✅ **Cores parametrizáveis** em um único arquivo
- ✅ **Componentes reutilizáveis** para UI
- ✅ **Navegação com tabs** e rotas dinâmicas
- ✅ **TypeScript** para type-safety
- ✅ **Layout responsivo**
- ✅ **React Query** para cache e gerenciamento de estado

## 📁 Estrutura do Projeto

```
projeto/
├── app/                          # Rotas do aplicativo (Expo Router)
│   ├── (tabs)/                   # Navegação em tabs
│   │   ├── index.tsx             # Home/Feed de produtos
│   │   ├── explore.tsx           # Explorar categorias
│   │   ├── cart.tsx              # Carrinho de compras
│   │   └── profile.tsx           # Perfil do usuário
│   ├── product/
│   │   └── [id].tsx              # Detalhes do produto
│   ├── search.tsx                # Tela de busca
│   ├── modal.tsx                 # Exemplo de modal
│   └── _layout.tsx               # Layout raiz
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes de UI genéricos
│   │   ├── Button.tsx            # Botão personalizável
│   │   ├── Card.tsx              # Card/Container
│   │   ├── Badge.tsx             # Badge/Tag
│   │   ├── Avatar.tsx            # Avatar do usuário
│   │   └── Loading.tsx           # Indicador de carregamento
│   │
│   ├── marketplace/              # Componentes específicos de marketplace
│   │   ├── ProductCard.tsx       # Card de produto
│   │   ├── CategoryCard.tsx      # Card de categoria
│   │   └── SearchBar.tsx         # Barra de busca
│   │
│   └── Themed.tsx                # Componentes nativos com tema
│
├── services/                     # Camada de serviços (API)
│   ├── auth.ts                   # Autenticação (login, signup)
│   ├── products.ts               # Produtos (listar, buscar)
│   ├── product.ts                # Produto individual e reviews
│   └── categories.ts             # Categorias
│
├── constants/
│   └── Colors.ts                 # ⭐ CORES PARAMETRIZÁVEIS
│
├── context/
│   └── ThemeContext.tsx          # Context para gerenciamento de tema
│
├── hooks/
│   └── useColorScheme.ts         # Hook para acessar o esquema de cores
│
├── types/
│   └── index.ts                  # Definições de tipos TypeScript
│
├── .env                          # Variáveis de ambiente (não versionado)
├── app.json                      # Configuração do Expo
├── package.json                  # Dependências
└── tsconfig.json                 # Configuração TypeScript
```

## 🚀 Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd <pasta-do-projeto>

# Instalar dependências
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://sua-api.com/api
```

Ou configure diretamente em `app.json`:

```json
{
  "expo": {
    "extra": {
      "baseUrl": "https://sua-api.com/api"
    }
  }
}
```

## ▶️ Execução

```bash
# Iniciar o Expo
npm start

# Ou executar diretamente em uma plataforma:
npm run android   # Android
npm run ios       # iOS (requer macOS)
npm run web       # Web
```

## 🔗 Integração com API

### Endpoints Implementados

#### Autenticação

- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login (retorna token JWT)

#### Produtos

- `GET /products` - Listar produtos (com paginação)
- `GET /products/:id` - Detalhes do produto
- `GET /products/:id/reviews` - Reviews do produto
- `GET /users/:id/products` - Produtos do usuário

#### Categorias

- `GET /categories` - Listar categorias

### Autenticação

O app utiliza **JWT Bearer Token** armazenado em `AsyncStorage`:

```typescript
// Exemplo de requisição autenticada
const token = await AsyncStorage.getItem("authToken");
const response = await axios.get(`${BASE_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Estrutura de Dados

#### Product

```typescript
{
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
}
```

#### Category

```typescript
{
  id: string;
  name: string;
  icon: string;
  productCount: number;
}
```

#### Review

```typescript
{
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}
```

## 🎨 Personalização de Cores

### Como alterar as cores do app

Todas as cores do aplicativo estão centralizadas em **um único arquivo**: `constants/Colors.ts`

#### Exemplo:

```typescript
// constants/Colors.ts

export const Colors = {
  light: {
    // ⬇️ Altere estas cores para personalizar o app!
    primary: "#007AFF", // Cor principal (botões, links)
    secondary: "#5856D6", // Cor secundária
    tertiary: "#FF9500", // Cor terciária

    background: "#FFFFFF", // Fundo da tela
    card: "#FFFFFF", // Fundo dos cards

    text: "#000000", // Texto principal
    textSecondary: "#6B7280", // Texto secundário

    success: "#10B981", // Verde (sucesso)
    error: "#EF4444", // Vermelho (erro)
    warning: "#F59E0B", // Amarelo (aviso)

    // Cores específicas de marketplace
    price: "#10B981", // Preço
    discount: "#EF4444", // Desconto
    rating: "#F59E0B", // Estrelas de avaliação
  },
  dark: {
    // ... mesmas propriedades para o tema escuro
  },
};
```

### Usar cores nos componentes

```typescript
import { useTheme } from "@/context/ThemeContext";

function MeuComponente() {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Olá!</Text>
    </View>
  );
}
```

## 🧩 Componentes

### Componentes UI Base

#### `Button`

```tsx
<Button
  title="Clique aqui"
  variant="primary" // primary | secondary | outline | ghost
  size="medium" // small | medium | large
  onPress={() => {}}
/>
```

#### `Card`

```tsx
<Card pressable onPress={() => {}}>
  <Text>Conteúdo do card</Text>
</Card>
```

#### `Badge`

```tsx
<Badge
  label="Novo"
  variant="success" // primary | secondary | success | warning | error | info
  size="medium" // small | medium
/>
```

#### `Avatar`

```tsx
<Avatar
  name="João Silva"
  size={40}
  source={{ uri: "https://..." }} // opcional
/>
```

### Componentes de Marketplace

#### `ProductCard`

```tsx
<ProductCard product={product} onPress={(product) => console.log(product)} />
```

#### `CategoryCard`

```tsx
<CategoryCard
  category={category}
  onPress={(category) => console.log(category)}
/>
```

#### `SearchBar`

```tsx
<SearchBar
  placeholder="Buscar produtos..."
  onSearch={(query) => console.log(query)}
/>
```

### Componentes Themed

Wrappers dos componentes nativos que respondem automaticamente ao tema:

```tsx
import { View, Text, TextInput, ScrollView } from "@/components/Themed";

<View color="background">
  <Text type="title" color="text">
    Título
  </Text>
  <Text type="subtitle">Subtítulo</Text>
  <TextInput placeholder="Digite..." />
</View>;
```

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** ~54.0 - Plataforma de desenvolvimento
- **Expo Router** ~6.0 - Roteamento file-based
- **TypeScript** ~5.9 - Tipagem estática
- **React** 19.1 - Biblioteca UI
- **React Native Reanimated** ~4.1 - Animações

## 📱 Funcionalidades Implementadas

- ✅ Autenticação JWT (login/signup)
- ✅ Listagem de produtos com API REST
- ✅ Categorias dinâmicas da API
- ✅ Busca de produtos com filtros
- ✅ Detalhes do produto
- ✅ Sistema de reviews com usuários
- ✅ Perfil do usuário com "Seus Produtos"
- ✅ Modo claro/escuro
- ✅ Navegação por tabs
- ✅ React Query para cache e estado

## 🎯 Roadmap

- [ ] Filtros por preço e categoria
- [ ] Infinite scroll / paginação
- [ ] Pull-to-refresh
- [ ] Carrinho de compras funcional
- [ ] Sistema de favoritos
- [ ] Notificações push
- [ ] Testes unitários e E2E
- [ ] Integração com gateway de pagamento
