export function generateHpa(chartName: string): string {
  return `
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  labels:
    app: {{ template "${chartName}.name" . }}
    chart: {{ template "${chartName}.chart" . }}
    component: "{{ .Values.name }}"
    heritage: {{ .Release.Service }}
    release: {{ template "${chartName}.fullname" . }}
  name: {{ template "${chartName}.fullname" . }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ template "${chartName}.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
{{- with .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        targetAverageUtilization: {{ . }}
{{- end }}
{{- with .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        targetAverageUtilization: {{ . }}
{{- end }}
{{- end }}
  `;
}