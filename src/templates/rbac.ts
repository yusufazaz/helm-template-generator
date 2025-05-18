export function generateRbac(chartName: string): string {
  return `
{{- if .Values.rbac.create -}}
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: {{ template "${chartName}.fullname" . }}
  namespace: {{ .Release.Namespace | quote }}
  labels:
    app: {{ template "${chartName}.name" . }}
    chart: {{ template "${chartName}.chart" . }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
rules:
  - apiGroups: [""]
    resources: ["services", "pods", "endpoints", "configmaps"]
    verbs: ["get","list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: {{ template "${chartName}.fullname" . }}
  labels:
    app: {{ template "${chartName}.name" . }}
    chart: {{ template "${chartName}.chart" . }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: {{ template "${chartName}.fullname" . }}
subjects:
  - name: {{ template "${chartName}.serviceAccountName" . }}
    namespace: {{ .Release.Namespace | quote }}
    kind: ServiceAccount
{{- end -}}  
  `;
}