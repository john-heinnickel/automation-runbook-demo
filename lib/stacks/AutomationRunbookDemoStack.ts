import { Stack, StackProps } from 'aws-cdk-lib';
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Construct } from 'constructs'
import {
  HardCodedString,
  AutomationDocument,
  AwsApiStep,
  BranchStep, Choice,
  DataTypeEnum,
  DocumentFormat,
  Input, InvokeLambdaFunctionStep, Operation,
  StringVariable, AwsService
} from "@cdklabs/cdk-ssm-documents";

import { AssetHelper } from '../classes/AssetHelper';

export class AutomationRunbookDemoStack extends Stack {
  readonly myDoc: AutomationDocument;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new Function(this, 'myFunctionName', {
      functionName: 'myFunctionName',
      runtime: Runtime.PYTHON_3_8,
      handler: 'index.lambda_handler',
      code: AssetHelper.getLambdaScript('my_function')
    });

    this.myDoc = new AutomationDocument(this, 'myAutomationRunbook', {
      documentFormat: DocumentFormat.YAML,
      tags: [{key: 'myTag',value: 'myValue'}],
      documentName: 'myAutomationRunbook',
      description: 'This is a sample runbook created by the CDK using @cdklabs/cdk-ssm-documents"!',
      updateMethod: 'NewVersion',
      docInputs: [
        Input.ofTypeString('Action', {
          allowedValues: ['API', 'Lambda'],
          description: '(Required) What step to execute.'})
        ],
    });

    const lambdaStep = new InvokeLambdaFunctionStep(this, 'lambda', {
      functionName: new HardCodedString('myFunctionName'),
      isEnd: true
    });
    
    const apiStep = new AwsApiStep(this, 'api', {
      service: AwsService.STS,
      pascalCaseApi: 'getCallerIdentity',
      apiParams: {},
      isEnd: true,
      outputs: [{
        outputType: DataTypeEnum.STRING,
        name: 'User',
        selector: '$.UserId'
      }]
    });
    
    const branchStep = new BranchStep(this, 'branch', {
      choices: [
        new Choice({
          operation: Operation.STRING_EQUALS,
          variable: StringVariable.of('Action'),
          constant: 'API',
          jumpToStepName: apiStep.name}),
        new Choice({
          operation: Operation.STRING_EQUALS,
          variable: StringVariable.of('Action'),
          constant: 'Lambda',
          jumpToStepName: lambdaStep.name})
      ],
    });
    
    this.myDoc.addStep(branchStep);
    this.myDoc.addStep(apiStep);
    this.myDoc.addStep(lambdaStep);
  }
}
