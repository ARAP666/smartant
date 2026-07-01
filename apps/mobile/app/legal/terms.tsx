import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, fonts, spacing } from "@/shared/theme";

export default function TermsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Términos de uso</Text>
      <Text style={styles.notice}>
        Borrador para revisión legal antes de producción · versión 2026-07-01
      </Text>
      <Text style={styles.heading}>Alcance</Text>
      <Text style={styles.body}>
        SmartAnt es una herramienta de organización y educación financiera. No
        es una entidad financiera, no custodia dinero y no sustituye asesoría
        profesional.
      </Text>
      <Text style={styles.heading}>Cuenta</Text>
      <Text style={styles.body}>
        El usuario debe aportar información correcta, proteger sus credenciales
        y notificar accesos no autorizados. La biometría es opcional y solo
        protege el acceso local a una sesión existente.
      </Text>
      <Text style={styles.heading}>Cálculos y decisiones</Text>
      <Text style={styles.body}>
        Presupuestos, alertas, retos y proyecciones dependen de los datos
        registrados. El usuario debe revisar cada gasto y resultado antes de
        tomar decisiones.
      </Text>
      <Text style={styles.heading}>Contenido y recompensas</Text>
      <Text style={styles.body}>
        XP, niveles e insignias no representan dinero. Los beneficios con valor
        real solo estarán disponibles cuando sus condiciones y comercios
        aparezcan expresamente identificados.
      </Text>
      <Text style={styles.heading}>Cambios y terminación</Text>
      <Text style={styles.body}>
        Los cambios materiales se comunicarán y requerirán nueva aceptación
        cuando corresponda. La versión definitiva incluirá responsable legal,
        soporte, jurisdicción, suspensión y procedimiento de reclamos.
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
