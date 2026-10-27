import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { useAchados } from '../hooks/useAchados'
import AchadoCard from '../components/AchadoCard'
import { colors, spacing } from '../theme'

// Tela 2: a lista com tudo o que está salvo no aparelho.
export default function AlbumScreen() {
    const { achados, loading, error, removeAchado } = useAchados()

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🧭 Álbum de Achados</Text>
            <Text style={styles.subtitle}>Guarde o que você encontra pelo caminho</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={achados}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                // Estado vazio "honesto": diz que não há nada em vez de tela em branco.
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyEmoji}>🍂</Text>
                        <Text style={styles.empty}>Seu álbum ainda está vazio. Que tal registrar o primeiro achado?</Text>
                    </View>
                }
                renderItem={({ item, index }) => <AchadoCard achado={item} onDelete={removeAchado} rotation={index % 2 === 0 ? '-1deg' : '1deg'} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 48, paddingHorizontal: spacing.lg, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    title: { fontSize: 24, fontWeight: '700', color: colors.heading },
    subtitle: { fontSize: 14, color: colors.muted, marginTop: spacing.xs },
    list: { paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.xl },
    errorText: { color: colors.error, fontSize: 14, marginTop: spacing.sm },
    emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingTop: 80 },
    emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
    empty: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
})
