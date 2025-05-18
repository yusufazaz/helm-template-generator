import * as fs from 'fs';
import * as path from 'path';

import { generateChartYaml } from './templates/chartYaml';
import { generateValuesYaml } from './templates/valuesYaml';
import { generateHelpersTpl } from './templates/helpersTpl';
import { generateDeployment } from './templates/deployment';
import { generateService } from './templates/service';
import { generateIngress } from './templates/ingress';
import { generateServiceAccount } from './templates/serviceaccount';
import { generateNotes } from './templates/NOTES';
import { generateHpa  } from './templates/hpa'; 
import { generatePdb } from './templates/poddisruptionbudget';
import { generateConfigMap } from './templates/configmap';
import { generateSecret } from './templates/secret';
import { generateRbac } from './templates/rbac';

const chartName = process.argv[2];

if (!chartName) {
  console.error('Please provide a chart name');
  process.exit(1);
}

const baseDir = path.join(process.cwd(), chartName);
const templatesDir = path.join(baseDir, 'templates');

fs.mkdirSync(templatesDir, { recursive: true });

fs.writeFileSync(path.join(baseDir, 'Chart.yaml'), generateChartYaml(chartName));
fs.writeFileSync(path.join(baseDir, 'values.yaml'), generateValuesYaml());
fs.writeFileSync(path.join(templatesDir, '_helpers.tpl'), generateHelpersTpl(chartName));
fs.writeFileSync(path.join(templatesDir, 'deployment.yaml'), generateDeployment(chartName));
fs.writeFileSync(path.join(templatesDir, 'NOTES.txt'), generateNotes(chartName));
fs.writeFileSync(path.join(templatesDir, 'serviceaccount.yaml'), generateServiceAccount(chartName));
fs.writeFileSync(path.join(templatesDir, 'service.yaml'), generateService(chartName));
fs.writeFileSync(path.join(templatesDir, 'ingress.yaml'), generateIngress(chartName));
fs.writeFileSync(path.join(templatesDir, 'secret.yaml'), generateSecret(chartName));
fs.writeFileSync(path.join(templatesDir, 'configmap.yaml'), generateConfigMap(chartName));
fs.writeFileSync(path.join(templatesDir, 'hpa.yaml'), generateHpa(chartName));
fs.writeFileSync(path.join(templatesDir, 'poddisruptionbudget.yaml'), generatePdb(chartName));
fs.writeFileSync(path.join(templatesDir, 'rbac.yaml'), generateRbac(chartName));
console.log(`Helm chart '${chartName}' created successfully.`);
