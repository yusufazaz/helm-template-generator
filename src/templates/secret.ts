export function generateSecret(chartName: string): string {
  return `
{{- if .Values.service_secrets -}}
apiVersion: kubernetes-client.io/v1
kind: ExternalSecret
metadata:
  name: {{ .Release.Name }}
spec:
  backendType: secretsManager
  data:
    {{- range $key, $value := .Values.extraEnvSecrets }}
    - key: {{ $.Values.service_secrets.secretstore }}
      name: {{ $key }}
      property: {{ $value }}
    {{ end }}
  {{- end -}}

  `;
}