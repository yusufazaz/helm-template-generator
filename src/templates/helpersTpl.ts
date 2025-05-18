export function generateHelpersTpl(chartName: string): string {
  return `{{/* vim: set filetype=mustache: */}}
{{/* Expand the name of the chart. */}}
{{- define "${chartName}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Create a default fully qualified app name. */}}
{{- define "${chartName}.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/* Create chart name and version as used by the chart label. */}}
{{- define "${chartName}.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Create the name of the service account to use */}}
{{- define "${chartName}.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{ default (include "${chartName}.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
{{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}`;
}
