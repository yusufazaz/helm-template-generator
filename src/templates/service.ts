export function generateService(chartName: string): string {
  return `
{{- if and .Values.service.enabled -}}
apiVersion: v1
kind: Service
metadata:
  name: {{ template "${chartName}.fullname" . }}
  namespace: {{ .Release.Namespace | quote }}
  annotations:
  {{- range $key, $value := .Values.service.annotations }}
    {{ $key }}: {{ $value | quote }}
  {{- end }}
  labels:
    app: {{ template "${chartName}.name" . }}
    chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    release: "{{ .Release.Name }}"
    heritage: "{{ .Release.Service }}"
spec:
  type: {{ .Values.service.type }}
  {{- if (or (eq .Values.service.type "LoadBalancer") (eq .Values.service.type "NodePort")) }}
  {{- if hasKey .Values.service "externalTrafficPolicy" -}}
  externalTrafficPolicy: {{ .Values.service.externalTrafficPolicy | quote }}
  {{- end }}
  {{- end }}
  {{- if eq .Values.service.type "LoadBalancer" }}
  loadBalancerIP: {{ default "" .Values.service.loadBalancerIP | quote }}
  {{- end }}
  ports:
  - name: http
    port: {{ .Values.service.httpPort }}
    targetPort: http
{{- if hasKey .Values.service "nodePort" }}
    nodePort: {{ .Values.service.nodePort }}
{{- end }}
  selector:
    app: {{ template "${chartName}.name" . }}
    release: {{ .Release.Name | quote }}
{{- end -}}
`;
}