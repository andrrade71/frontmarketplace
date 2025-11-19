# 🛍️ Front Marketplace

Aplicativo de marketplace desenvolvido com React Native, Expo e TypeScript, com foco em **componentes reutilizáveis** e **cores parametrizáveis**.

## 📋 Índice

- [Características](#-características)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Personalização de Cores](#-personalização-de-cores)
- [Componentes](#-componentes)
- [Tecnologias](#-tecnologias)

## ✨ Características

- ✅ **Sistema de temas** (Light/Dark mode)
- ✅ **Cores parametrizáveis** em um único arquivo
- ✅ **Componentes reutilizáveis** para UI
- ✅ **Navegação com tabs** e rotas dinâmicas
- ✅ **TypeScript** para type-safety
- ✅ **Layout responsivo**
- ✅ **Componentes específicos** de marketplace

## 📁 Estrutura do Projeto

```
frontmarketplace/
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
├── constants/
│   └── Colors.ts                 # ⭐ CORES PARAMETRIZÁVEIS (altere aqui!)
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
├── data/
│   └── mockData.ts               # Dados mockados para desenvolvimento
│
├── app.json                      # Configuração do Expo
├── package.json                  # Dependências
├── tsconfig.json                 # Configuração TypeScript
└── babel.config.js               # Configuração Babel
```

## 🚀 Instalação

```powershell
# Navegar para a pasta do projeto
cd "c:/Users/vitor/OneDrive/Desktop/Projeto facul/frontmarketplace/frontmarketplace"

# Instalar dependências (se necessário)
npm install
```

## ▶️ Execução

```powershell
# Iniciar o Expo
npm start

# Ou executar diretamente em uma plataforma:
npm run android   # Android
npm run ios       # iOS (requer macOS)
npm run web       # Web
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

- ✅ Listagem de produtos com grid responsivo
- ✅ Categorias de produtos
- ✅ Busca de produtos
- ✅ Detalhes do produto
- ✅ Sistema de avaliações (rating)
- ✅ Descontos e preços promocionais
- ✅ Carrinho de compras (estrutura)
- ✅ Perfil do usuário
- ✅ Modo claro/escuro
- ✅ Navegação por tabs

## 🎯 Próximos Passos Sugeridos

- [ ] Implementar Context para carrinho de compras
- [ ] Adicionar autenticação (login/signup)
- [ ] Integrar com API backend
- [ ] Adicionar filtros de busca
- [ ] Implementar favoritos
- [ ] Adicionar animações
- [ ] Testes unitários
- [ ] Integração com gateway de pagamento

## 📄 Licença

Este projeto foi criado para fins educacionais.

---

**Desenvolvido com ❤️ usando React Native + Expo**
