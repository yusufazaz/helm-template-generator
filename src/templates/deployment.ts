export function generateDeployment(chartName: string): string {
  return `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${chartName}.fullname" . }}
  labels:
    app.kubernetes.io/name: {{ include "${chartName}.name" . }}
    helm.sh/chart: {{ include "${chartName}.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
    app: {{ include "${chartName}.name" . }}
    chart: {{ include "${chartName}.chart" . }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}    
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "${chartName}.name" . }}
      release: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ include "${chartName}.name" . }}
        release: {{ .Release.Name }}
      annotations:
        {{ toYaml .Values.podAnnotations | indent 8 }}
    spec:
      serviceAccountName: {{ template "${chartName}.serviceAccountName" . }}
      securityContext:
        {{ toYaml .Values.securityContext | indent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            {{- if hasKey .Values.spring "profile" }}
            - name: SPRING_PROFILES_ACTIVE
              value: {{ .Values.spring.profile }}
            {{- end }}
              {{- if .Values.spring.trustKubernetesCertificates }}
            - name: KUBERNETES_TRUST_CERTIFICATES
              value: "true"
              {{- end }}
            {{- if and (eq .Values.spring.config.type "file") (hasKey .Values.spring.config "content") }}
            - name: SPRING_CONFIG_LOCATION
              value: "file:/config/application.yml"
            {{- end }}
            {{- if hasKey .Values.spring.config "secretName" }}
            - name: SPRING_CONFIG_ADDITIONAL_LOCATION
              value: "file:/config/secret.yml"
            {{- end }}
            {{- range $key, $value := .Values.extraEnv }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          volumeMounts:
            - name: data
              mountPath: /data
            {{- if and (eq .Values.spring.config.type "file") (hasKey .Values.spring.config "content") }}
            - name: config-file
              mountPath: /config/application.yml
              subPath: application.yml
            {{- end }}
          ports:
            - name: http
              containerPort: {{ .Values.containerPort }}
              protocol: TCP
          {{- if .Values.livenessProbe }}
          livenessProbe:
{{ toYaml .Values.livenessProbe | indent 12 }}
          {{- end }}
          {{- if .Values.readinessProbe }}
          readinessProbe:
{{ toYaml .Values.readinessProbe | indent 12 }}
          {{- end }}
          resources:
{{ toYaml .Values.resources | indent 12 }}
    {{- with .Values.nodeSelector }}
      nodeSelector:
{{ toYaml . | indent 8 }}
    {{- end }}
    {{- with .Values.affinity }}
      affinity:
{{ toYaml . | indent 8 }}
    {{- end }}
    {{- with .Values.tolerations }}
      tolerations:
{{ toYaml . | indent 8 }}
    {{- end }}
      volumes:
        - name: data
          emptyDir: {}
      {{- if and (eq .Values.spring.config.type "file") (hasKey .Values.spring.config "content") }}
        - name: config-file
          configMap:
            name: {{ include "${chartName}.fullname" . }}-config
      {{- end }}
      {{- if hasKey .Values.spring.config "secretName" }}
        - name: secret-file
          secret:
            secretName: {{ .Values.spring.config.secretName }}
      {{- end }}

`;
}
