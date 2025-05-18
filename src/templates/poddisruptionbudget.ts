export function generatePdb(chartName: string): string {
  return `
{{- if .Values.podDisruptionBudget.enabled }}
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: {{ template "${chartName}.controller.fullname" . }}
  namespace: {{ .Release.Namespace | quote }}
  labels:
    app: {{ template "${chartName}.name" . }}
    heritage: "{{ .Release.Service }}"
    release: "{{ .Release.Name }}"
    chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
spec:
  selector:
    matchLabels:
      app: {{ template "${chartName}.name" . }}
      heritage: "{{ .Release.Service }}"
      release: "{{ .Release.Name }}"
      chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  minAvailable: {{ .Values.podDisruptionBudget.minAvailable }}
{{- end }}
  `;
}