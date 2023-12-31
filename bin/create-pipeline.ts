import { App, Environment, Aspects } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'

import { CdkPipelineStack } from '../lib/stacks'
import { FixCodeRoles } from '../lib/classes/FixCodeRoles'

const ciEnv: Environment = { account: '284611682665', region: 'us-east-1' }
const env1: Environment = { account: '284611682665', region: 'us-east-1' }
const env2: Environment = { account: '811617080253', region: 'us-east-1' }

/*
const stackSynthesizer = new cdk.DefaultStackSynthesizer({
    qualifier: 'demo-ssm',
    bootstrapStackVersionSsmParameter: '/cdk-bootstrap/demo-ssm/version'
});
*/

const app = new App();
Role.customizeRoles(app, { preventSynthesis: false });

const pipeline = new CdkPipelineStack(app, 'bPipeline', {
    ciEnv: ciEnv, devEnv: env1, prodEnv: env2,
    // synthesizer: stackSynthesizer
});

// const dbgr = new FixCodeRoles();
// Aspects.of(pipeline).add(dbgr);

pipeline.synth()
app.synth()
