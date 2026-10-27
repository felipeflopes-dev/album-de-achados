import { ScrollView, StyleSheet, Text } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../types'
import AchadoForm from '../components/AchadoForm'

type Props = BottomTabScreenProps<TabParamList, 'Novo'>

// Tela 1: o formulário de novo achado.
export default function NovoAchadoScreen({ navigation }: Props) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Novo achado</Text>
            {/* Depois de salvar, leva o usuário direto para o álbum. */}
            <AchadoForm onSaved={() => navigation.navigate('Album')} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    content: { paddingTop: 60, paddingHorizontal: 16 },
    title: { fontSize: 22, fontWeight: '700', color: '#2B2B2B' },
})
