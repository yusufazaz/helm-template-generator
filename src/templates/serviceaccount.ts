export function generateServiceAccount(chartName: string): string {
  return `
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ template "${chartName}.serviceAccountName" . }}
  namespace: {{ .Release.Namespace | quote }}
  labels:
    app: {{ template "${chartName}.name" . }}
    chart: {{ template "${chartName}.chart" . }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
{{- end -}}
  `;
}