import { useCallback, useRef, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useFocusEffect } from '@react-navigation/native'
import { achadoRepository, InvalidAchadoError } from '../storage/AchadoRepository'
import { useCurrentLocation } from '../hooks/useCurrentLocation'

type Props = {
    // Avisa a tela que o achado foi salvo (a tela decide o que fazer depois).
    onSaved: () => void
}

// A CENTRAL DE COMANDO: o formulário não tem regra de negócio.
// Ele só junta os campos, a câmera, o GPS e chama o repositório.
export default function AchadoForm({ onSaved }: Props) {
    // Campos do tema
    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')

    // Câmera
    const [permission, requestPermission] = useCameraPermissions()
    const [cameraOpen, setCameraOpen] = useState(false)
    const [cameraReady, setCameraReady] = useState(false)
    const [photoUri, setPhotoUri] = useState<string | null>(null)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const cameraRef = useRef<CameraView>(null)

    // GPS
    const location = useCurrentLocation()

    // Salvar
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    // Só pode haver UMA pré-visualização de câmera ativa. Ao sair da aba,
    // a função de limpeza roda e a câmera é fechada.
    useFocusEffect(
        useCallback(() => {
            return () => setCameraOpen(false)
        }, [])
    )

    async function openCamera() {
        setCameraError(null)
        if (!permission?.granted) {
            const result = await requestPermission()
            if (!result.granted) {
                setCameraError(
                    result.canAskAgain
                        ? 'Precisamos da câmera. Toque em "Tirar foto" e permita o acesso.'
                        : 'A permissão da câmera foi negada. Libere nas configurações do aparelho.'
                )
                return
            }
        }
        setCameraReady(false)
        setCameraOpen(true)
    }

    async function takePicture() {
        try {
            const photo = await cameraRef.current?.takePictureAsync()
            if (photo) {
                setPhotoUri(photo.uri)
                setCameraOpen(false)
            }
        } catch {
            setCameraError('Não foi possível tirar a foto. Tente novamente.')
        }
    }

    async function saveAchado() {
        setSaving(true) // trava o botão: sem isso, dois toques salvam dois achados
        setSaveError(null)
        try {
            await achadoRepository.create({
                title,
                note: note.trim(),
                photoUri,
                // `?? null`: sem GPS grava null (undefined seria descartado pelo JSON)
                latitude: location.coords?.latitude ?? null,
                longitude: location.coords?.longitude ?? null,
            })
            // Limpa o formulário para o próximo achado
            setTitle('')
            setNote('')
            setPhotoUri(null)
            location.reset()
            onSaved()
        } catch (e) {
            setSaveError(
                e instanceof InvalidAchadoError
                    ? e.message
                    : 'Não foi possível salvar o achado. Tente novamente.'
            )
        } finally {
            setSaving(false) // sempre libera o botão, com sucesso ou com erro
        }
    }

    return (
        <View>
            {/* ---------- Campos do tema ---------- */}
            <Text style={styles.label}>Nome do achado</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex.: Pena azul, moeda antiga..."
            />

            <Text style={styles.label}>Comentário</Text>
            <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={note}
                onChangeText={setNote}
                placeholder="Onde você achou? Como era?"
                multiline
            />

            {/* ---------- Foto ---------- */}
            <Text style={styles.sectionTitle}>Foto</Text>
            {cameraOpen ? (
                <View>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing="back"
                        onCameraReady={() => setCameraReady(true)}
                        onMountError={() => {
                            setCameraOpen(false)
                            setCameraError('Câmera indisponível neste aparelho.')
                        }}
                    />
                    <View style={styles.row}>
                        <Pressable
                            style={[styles.button, styles.flex, !cameraReady && styles.disabled]}
                            onPress={takePicture}
                            disabled={!cameraReady}
                        >
                            <Text style={styles.buttonText}>Capturar</Text>
                        </Pressable>
                        <Pressable style={[styles.buttonOutline, styles.flex]} onPress={() => setCameraOpen(false)}>
                            <Text style={styles.buttonOutlineText}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View>
                    {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
                    <Pressable style={styles.buttonOutline} onPress={openCamera}>
                        <Text style={styles.buttonOutlineText}>{photoUri ? 'Tirar outra foto' : 'Tirar foto'}</Text>
                    </Pressable>
                </View>
            )}
            {cameraError && <Text style={styles.errorText}>{cameraError}</Text>}

            {/* ---------- Localização ---------- */}
            {!cameraOpen && (
                <View>
                    <Text style={styles.sectionTitle}>Localização</Text>
                    {location.status === 'loading' && <Text style={styles.info}>Obtendo localização…</Text>}
                    {location.coords && (
                        <Text style={styles.info}>
                            Latitude {location.coords.latitude.toFixed(5)} · Longitude {location.coords.longitude.toFixed(5)}
                        </Text>
                    )}
                    <Pressable
                        style={[styles.buttonOutline, location.status === 'loading' && styles.disabled]}
                        onPress={location.getLocation}
                        disabled={location.status === 'loading'}
                    >
                        <Text style={styles.buttonOutlineText}>
                            {location.coords ? 'Atualizar localização' : 'Obter localização'}
                        </Text>
                    </Pressable>
                    {location.message && <Text style={styles.errorText}>{location.message}</Text>}
                </View>
            )}

            {/* ---------- Salvar ---------- */}
            {!cameraOpen && (
                <View style={styles.saveBlock}>
                    <Pressable
                        style={[styles.button, saving && styles.disabled]}
                        onPress={saveAchado}
                        disabled={saving}
                    >
                        <Text style={styles.buttonText}>{saving ? 'Salvando…' : 'Guardar no álbum'}</Text>
                    </Pressable>
                    <Text style={styles.hint}>Vale ter a foto OU a localização (ou os dois).</Text>
                    {saveError && <Text style={styles.errorText}>{saveError}</Text>}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    label: { fontSize: 13, color: '#6B5E4B', marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#D9CFBC',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2F6F5E', marginTop: 24, marginBottom: 8 },
    camera: { width: '100%', height: 320, borderRadius: 12, overflow: 'hidden' },
    preview: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#DDD', marginBottom: 12 },
    row: { flexDirection: 'row', gap: 12, marginTop: 12 },
    flex: { flex: 1 },
    button: { backgroundColor: '#2F6F5E', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    buttonOutline: { borderWidth: 1, borderColor: '#2F6F5E', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    buttonOutlineText: { color: '#2F6F5E', fontWeight: '700', fontSize: 15 },
    disabled: { opacity: 0.45 },
    info: { color: '#333', marginBottom: 8 },
    hint: { marginTop: 8, color: '#6B5E4B', fontSize: 13 },
    errorText: { marginTop: 12, color: '#B00020' },
    saveBlock: { marginTop: 32, marginBottom: 24 },
})
