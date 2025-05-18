export function generateIngress(chartName: string): string {
  return `
{{- if .Values.ingress.enabled -}}
{{- $fullName := include "${chartName}.fullname" . }}
{{- $httpPort := .Values.service.httpPort }}
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ $fullName }}
  labels:
    app.kubernetes.io/name: {{ .Values.name }}
    helm.sh/chart: {{ .Values.chart }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
  annotations:
  {{- range $key, $value := .Values.ingress.annotations }}
    {{ $key }}: {{ $value | quote }}
  {{- end }}
  labels:
    app: {{ template "${chartName}.name" . }}
    heritage: "{{ .Release.Service }}"
    release: "{{ .Release.Name }}"
    chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  name: {{ template "${chartName}.fullname" . }}
  namespace: {{ .Release.Namespace | quote }}
spec:
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
      {{- end }}
      secretName: {{ .secretName }}
  {{- end }}
  {{- end }}
  rules:
  {{- range .Values.ingress.hosts }}
    - host: {{ . }}
      http:
        paths:
        {{- if index $.Values.ingress "annotations" }}
          {{- if eq (index $.Values.ingress.annotations "kubernetes.io/ingress.class" | default "") "gce" "alb" }}
          - path: /*
          {{- else }}{{/* Has annotations but ingress class is not "gce" nor "alb" */}}
          - path: /
          {{- end }}
        {{- else}}{{/* Has no annotations */}}
          - path: /
        {{- end }}
            backend:
              serviceName: {{ $fullName }}
              servicePort: {{ $httpPort }}
  {{- end -}}
  {{- if .Values.ingress.tls }}
  tls:
{{ toYaml .Values.ingress.tls | indent 4 }}
  {{- end -}}
{{- end -}}
`;
}