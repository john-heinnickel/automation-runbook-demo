#!/bin/sh

export AWS_PROFILE=irtemp
export AWS_PROFILE_ID=irtemp
export AWS_REGION=us-east-1
CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap --force --profile irtemp -i --tags costcenter=10051227 --tags division=csd --tags environment=nonprod --tags application=IonReporter --tags app_role=demoSsm --qualifier demo-ssm --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --toolkit-stack-name csd-demo-ssm --trust 284611682665 --trust-for-lookup 284611682665 --context tryctxt=tryvalue --context deployment=demo-ssm -v aws://284611682665/us-east-1 2>&1 | tee bootlog2_2665.log
