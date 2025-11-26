
import { View, Text, ScrollView } from "@/components/Themed";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { SearchBar } from "@/components/marketplace";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function PlaceHolder() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    function placeholderList (placeholderLength: number, widthCard?: number, heightCard?: number) {
        if (!widthCard) widthCard = CARD_WIDTH;

        const items = Array.from({ length: placeholderLength }).map((_, index) => (
        <Animated.View
            key={index}
            style={[
                styles.placeholderCard,
                { opacity, width: widthCard, height: heightCard  || CARD_WIDTH },
            ]}
        />
        ));
        
        return items;
    }
    

    return (
        <ScrollView >
            <SearchBar isDisabled={true}/>

            <Text type="subtitle" style={styles.sectionTitle}>
                Categorias
            </Text>
            <View style={styles.container}>
                {placeholderList(4, 105, 100)}
            </View>

            <Text type="subtitle" style={[styles.sectionTitle, {marginTop: 33}]}>
                Destaques
            </Text>
            <View style={styles.container}>
                {placeholderList(4)}
            </View>

            <Text type="subtitle" style={styles.sectionTitle}>
                Todos os Produtos
            </Text>
            <View style={styles.container}>
                {placeholderList(4)}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        gap: 15,
    },
    placeholderCard: {
        height: CARD_WIDTH,
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        margin: 16,        
    },
});