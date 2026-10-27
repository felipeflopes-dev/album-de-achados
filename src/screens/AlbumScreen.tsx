import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { useAchados } from '../hooks/useAchados'
import AchadoCard from '../components/AchadoCard'

// Tela 2: a lista com tudo o que está salvo no aparelho.
export default function AlbumScreen() {
    const { achados, loading, error, removeAchado } = useAchados()

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2F6F5E" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu álbum</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={achados}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                // Estado vazio "honesto": diz que não há nada em vez de tela em branco.
                ListEmptyComponent={
                    <Text style={styles.empty}>Nenhum achado ainda. Vá em "Novo" e registre o primeiro!</Text>
                }
                renderItem={({ item }) => <AchadoCard achado={item} onDelete={removeAchado} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#FAF6EE' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6EE' },
    title: { fontSize: 22, fontWeight: '700', color: '#2B2B2B' },
    list: { paddingTop: 16, paddingBottom: 24, gap: 16 },
    errorText: { color: '#B00020', fontSize: 14, marginTop: 8 },
    empty: { fontSize: 14, color: '#6B5E4B', marginTop: 12 },
})
