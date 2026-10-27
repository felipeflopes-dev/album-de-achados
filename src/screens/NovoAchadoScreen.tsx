import { ScrollView, StyleSheet, Text } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../types'
import AchadoForm from '../components/AchadoForm'
import { colors, spacing } from '../theme'

type Props = BottomTabScreenProps<TabParamList, 'Novo'>

// Tela 1: o formulário de novo achado.
export default function NovoAchadoScreen({ navigation }: Props) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>🧭 Álbum de Achados</Text>
            <Text style={styles.subtitle}>Guarde o que você encontra pelo caminho</Text>
            {/* Depois de salvar, leva o usuário direto para o álbum. */}
            <AchadoForm onSaved={() => navigation.navigate('Album')} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: 48, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    title: { fontSize: 24, fontWeight: '700', color: colors.heading },
    subtitle: { fontSize: 14, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.xl },
})
