export function generateValuesYaml(): string {
  return `
replicaCount: 1

image:
  repository: yusufazaz/helloworld
  pullPolicy: IfNotPresent
  tag: "v1.0.0"

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

rbac:
  create: true
  
serviceAccount:
  create: true
  annotations: {}
  name: ""
  
spring: {}
    
podAnnotations: {}

secretKeyRefName: app-secret-ref

extraEnvSecrets: 
  DB_USER: db-user
  DB_PASSWD: db-pass

podSecurityContext: {}
  # fsGroup: 2000

securityContext: {}
  # runAsUser: 1000


containerPort: 8090

livenessProbe: 
  httpGet:
    path: /actuator/health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe: 
  httpGet:
    path: /actuator/health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10

service:
  enabled: true
  type: ClusterIP
  httpPort: 80

ingress:
  enabled: false
 
resources: 
   limits:
     cpu: 500m
     memory: 2048Mi
   requests:
     cpu: 100m
     memory: 512Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 4
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}

podDisruptionBudget:
  enabled: false
  minAvailable: 1
`;
}