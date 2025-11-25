import { ProductCard } from "@/components/marketplace/ProductCard";
import { ScrollView, Text, View } from "@/components/Themed";
import { Avatar, Button, Card } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import { getUserProfile, login } from "@/services/auth";
import { getProductsByUserId } from "@/services/products";
import { Product, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";

export default function ProfileScreen() {
  const { colors, colorScheme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
          // fetch user's products
          if (userData?.id) {
            try {
              setProductsLoading(true);
              const list = await getProductsByUserId(String(userData.id));
              setProducts(list);
            } catch (e) {
              console.warn("Failed to load user products", e);
            } finally {
              setProductsLoading(false);
            }
          }
        } catch (error) {
          // Token is invalid or expired, remove it
          await AsyncStorage.removeItem("authToken");
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setUser(user);
      setEmail("");
      setPassword("");
      // load user's products after login
      try {
        setProductsLoading(true);
        const list = await getProductsByUserId(String(user.id));
        setProducts(list);
      } catch (e) {
        console.warn("Failed to load user products", e);
      } finally {
        setProductsLoading(false);
      }
    } catch (error) {
      const err = error as any;

      // Map common auth errors to friendly Portuguese messages
      let message = "Não foi possível fazer login";

      if (err?.name === "AuthError" || err?.status) {
        const status = err.status;
        if (status === 401) {
          message = "E-mail ou senha incorretos";
        } else if (status === 404) {
          message = "E-mail não cadastrado";
        } else if (err.message) {
          message = err.message;
        }
      } else if (err?.message) {
        message = err.message;
      }

      Alert.alert("Erro no Login", message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setUser(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const list = await getProductsByUserId(String(user?.id));
      setProducts(list);
    } catch (e) {
      console.warn("Failed to refresh user products", e);
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.loginContainer}
      >
        <View style={styles.loginContent} color="background">
          {/* Logo/Icon */}
          <View style={styles.logoContainer} color="background">
            <Text style={styles.logoText}>🛒</Text>
            <Text type="title" style={styles.loginTitle}>
              Marketplace
            </Text>
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeContainer} color="background">
            <Text type="subtitle" style={styles.welcomeTitle}>
              Bem-vindo de volta!
            </Text>
            <Text color="textSecondary" style={styles.welcomeSubtitle}>
              Faça login para continuar
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer} color="background">
            <View style={styles.inputContainer} color="background">
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer} color="background">
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <Button
              title={loading ? "Entrando..." : "Fazer Login"}
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            />

            {loading && (
              <View style={styles.loadingContainer} color="background">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footerContainer} color="background">
            <Text color="textSecondary" style={styles.footerText}>
              Ainda não tem uma conta?
            </Text>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              Cadastre-se
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header} color="background">
        <Avatar name={user.name} size={80} />
        <Text type="title" style={styles.name}>
          {user.name}
        </Text>
        <Text color="textSecondary">{user.email}</Text>
      </View>

      {/* Seus Produtos Section Title */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Seus Produtos
        </Text>
        {productsLoading && (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
    </>
  );

  const renderFooter = () => (
    <>
      {/* Settings */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Configurações
        </Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow} color="card">
            <Text>Modo Escuro</Text>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.backgroundTertiary,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
      </View>

      {/* Menu Items */}
      <View style={styles.section} color="background">
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>📦 Meus Pedidos</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>❤️ Favoritos</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>📍 Endereços</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>💳 Formas de Pagamento</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>❓ Ajuda</Text>
        </Card>
      </View>

      <View style={styles.section} color="background">
        <Button title="Sair" variant="outline" onPress={handleLogout} />
      </View>
    </>
  );

  const renderEmptyProducts = () => (
    <Card style={{ padding: 16, margin: 8 }}>
      <Text style={{ textAlign: "center", marginBottom: 8 }}>
        Você ainda não anunciou produtos.
      </Text>
      <Button title="Anunciar produto" onPress={() => {}} />
    </Card>
  );

  return (
    <FlatList
      style={styles.container}
      data={productsLoading ? [] : products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={
        products.length > 0
          ? { justifyContent: "space-between", marginHorizontal: 8 }
          : undefined
      }
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={!productsLoading ? renderEmptyProducts : null}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={(p) => router.push(`/product/${p.id}` as any)}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loginContent: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 64,
    marginBottom: 8,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  loginButton: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  name: {
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuCard: {
    marginBottom: 12,
  },
});
