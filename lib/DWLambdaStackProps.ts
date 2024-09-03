import { StackProps } from "aws-cdk-lib";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

export interface DwLambdaStackProps extends StackProps {
  prodSecret: Secret;
  stagingSecret: Secret;
}
