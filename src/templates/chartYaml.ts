export function generateChartYaml(chartName: string): string {
  return `
apiVersion: v2
name: ${chartName}
description: A Helm chart for deployment of application ${chartName}  
type: application  
version: 0.1.0
appVersion: "1.0"
`;
}