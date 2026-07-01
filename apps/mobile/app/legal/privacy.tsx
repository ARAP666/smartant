import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, fonts, spacing } from "@/shared/theme";

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Política de privacidad</Text>
      <Text style={styles.notice}>
        Borrador para revisión legal antes de producción · versión 2026-07-01
      </Text>
      <Text style={styles.heading}>Datos tratados</Text>
      <Text style={styles.body}>
        Correo, preferencias, ingresos, presupuestos, metas, gastos, imágenes de
        recibos y datos técnicos mínimos para operar y proteger la cuenta.
      </Text>
      <Text style={styles.heading}>Finalidades</Text>
      <Text style={styles.body}>
        Prestar las funciones solicitadas, calcular resúmenes financieros,
        guardar comprobantes, proteger el acceso y mejorar estabilidad. SmartAnt
        no vende datos personales.
      </Text>
      <Text style={styles.heading}>Recibos y OCR</Text>
      <Text style={styles.body}>
        Las imágenes son privadas, se almacenan como bytes asociados a la cuenta
        y se procesan para proponer datos editables. El usuario puede registrar
        el gasto sin OCR.
      </Text>
      <Text style={styles.heading}>Derechos y control</Text>
      <Text style={styles.body}>
        El usuario puede solicitar acceso, corrección, actualización o
        eliminación conforme a la Ley 8968 de Costa Rica. Antes del lanzamiento
        se publicará el responsable, canal formal, plazos y política definitiva
        de retención.
      </Text>
      <Text style={styles.heading}>Seguridad</Text>
      <Text style={styles.body}>
        Se aplican sesiones revocables, almacenamiento seguro del dispositivo,
        aislamiento por usuario y validación de archivos. Ningún sistema ofrece
        seguridad absoluta.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.ink, fontFamily: fonts.body, lineHeight: 24 },
  heading: {
    color: colors.forest,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    marginTop: spacing[3],
  },
  notice: { color: colors.honeyStrong, fontFamily: fonts.bodyBold },
  screen: {
    backgroundColor: colors.bg,
    flexGrow: 1,
    gap: spacing[2],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 32 },
});
