import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Achado } from '../types'

type Props = {
    achado: Achado
    onDelete: (id: string) => void
}

// Um "cartão" do álbum: foto em cima, dados embaixo, botão de excluir.
export default function AchadoCard({ achado, onDelete }: Props) {
    // A foto pode ter sumido do aparelho (cache limpo). Nesse caso mostramos
    // um quadro vazio em vez de deixar o card quebrado.
    const [photoFailed, setPhotoFailed] = useState(false)

    // Compara com null (a coordenada 0 é válida).
    const temLocal = achado.latitude !== null && achado.longitude !== null

    return (
        <View style={styles.card}>
            {achado.photoUri && !photoFailed ? (
                <Image
                    source={{ uri: achado.photoUri }}
                    style={styles.photo}
                    onError={() => setPhotoFailed(true)}
                />
            ) : (
                <View style={[styles.photo, styles.noPhoto]}>
                    <Text style={styles.noPhotoText}>{achado.photoUri ? 'Foto indisponível' : 'Sem foto'}</Text>
                </View>
            )}

            <View style={styles.body}>
                <Text style={styles.title}>{achado.title}</Text>
                {achado.note !== '' && <Text style={styles.note}>{achado.note}</Text>}
                <Text style={styles.details}>
                    {temLocal
                        ? `📍 ${achado.latitude?.toFixed(5)}, ${achado.longitude?.toFixed(5)}`
                        : '📍 Local não registrado'}
                </Text>
                <Text style={styles.details}>🕒 {new Date(achado.createdAt).toLocaleString('pt-BR')}</Text>

                <Pressable style={styles.deleteButton} onPress={() => onDelete(achado.id)}>
                    <Text style={styles.deleteText}>Excluir</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E6DDCB',
        overflow: 'hidden',
    },
    photo: { width: '100%', height: 200, backgroundColor: '#DDD' },
    noPhoto: { alignItems: 'center', justifyContent: 'center' },
    noPhotoText: { color: '#6B5E4B' },
    body: { padding: 14 },
    title: { fontSize: 17, fontWeight: '700', color: '#2B2B2B' },
    note: { fontSize: 14, color: '#444', marginTop: 4 },
    details: { fontSize: 13, color: '#6B5E4B', marginTop: 6 },
    deleteButton: {
        alignSelf: 'flex-start',
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#B00020',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    deleteText: { color: '#B00020', fontWeight: '600' },
})
