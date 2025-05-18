export function generateConfigMap(chartName: string): string {
  return `
{{- if and ( eq .Values.spring.config.type "file") (hasKey .Values.spring.config "content") }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "${chartName}.fullname" . }}-config
  namespace: {{ .Release.Namespace | quote }}
  labels:
    app: {{ include "${chartName}.name" . }}
    chart: {{ include "${chartName}.chart" . }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
data:
  application.yml:
    {{ toYaml .Values.spring.config.content | indent 4  }}
{{- end }}  
  `;
}