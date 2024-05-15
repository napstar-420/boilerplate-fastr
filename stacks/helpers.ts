import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Arn, Stack } from 'aws-cdk-lib';
import type { ContainerDefinition, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Effect, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId, type AwsSdkCall } from 'aws-cdk-lib/custom-resources';
import { attachPermissionsToRole, type App, type Config } from 'sst/constructs';
import type { SSTConstruct } from 'sst/constructs/Construct.js';
import type { Secret } from 'sst/constructs/Secret.js';
import { bindEnvironment, bindPermissions, getReferencedSecrets } from 'sst/constructs/util/functionBinding.js';

export function subdomain(app: App, name?: string) {
  let domainName = 'fastr.health';

  switch (app.stage) {
    case 'production': {
      if (name) {
        domainName = `${name}.fastr.health`;
      }
      break;
    }
    default: {
      if (name) {
        domainName = `${name}-${app.stage}.fastr.health`;
      } else {
        domainName = `${app.stage}.fastr.health`;
      }
      break;
    }
  }

  return domainName;
}

export async function getSecretValue(app: App, secret: Config.Secret | Config.Parameter, isFallbackCall = false) {
  const type = secret.getConstructMetadata().type;
  const ssmName = `/sst/${app.name}/${isFallbackCall ? '.fallback' : app.stage}/${type}/${secret.name}/value`;

  try {
    const client = new SSMClient({ region: app.region });
    const result = await client.send(
      new GetParameterCommand({
        WithDecryption: type === 'Secret',
        Name: ssmName,
      }),
    );

    return result.Parameter?.Value ?? '';
  } catch {
    if (!isFallbackCall) {
      return getSecretValue(app, secret, true);
    } else {
      throw new Error(`Unable to retrieve value for ${ssmName}`);
    }
  }
}

interface SSMParameterReaderProps {
  parameterName: string;
  region: string;
}

export function removeLeadingSlash(value: string): string {
  return value.slice(0, 1) == '/' ? value.slice(1) : value;
}

export class SSMParameterReader extends AwsCustomResource {
  constructor(scope: Stack, name: string, props: SSMParameterReaderProps) {
    const { parameterName, region } = props;

    const ssmAwsSdkCall: AwsSdkCall = {
      service: 'SSM',
      action: 'getParameter',
      parameters: {
        Name: parameterName,
      },
      region,
      physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
    };

    const ssmCrPolicy = AwsCustomResourcePolicy.fromSdkCalls({
      resources: [
        Arn.format(
          {
            service: 'ssm',
            region: props.region,
            resource: 'parameter',
            resourceName: removeLeadingSlash(parameterName),
          },
          Stack.of(scope),
        ),
      ],
    });

    super(scope, name, { onUpdate: ssmAwsSdkCall, policy: ssmCrPolicy });
  }

  public getParameterValue(): string {
    return this.getResponseField('Parameter.Value').toString();
  }
}

export function bindFargate(container: ContainerDefinition, task: FargateTaskDefinition, constructs: SSTConstruct[]) {
  const referencedSecrets: Secret[] = [];
  constructs.forEach(c => referencedSecrets.push(...getReferencedSecrets(c)));

  [...constructs, ...referencedSecrets].forEach(c => {
    const env = bindEnvironment(c);
    Object.entries(env).forEach(([key, value]) => {
      container.addEnvironment(key, value);
    });

    const permissions = bindPermissions(c);
    Object.entries(permissions).forEach(([action, resources]) => {
      attachPermissionsToRole(task.taskRole as Role, [
        new PolicyStatement({
          actions: [action],
          effect: Effect.ALLOW,
          resources,
        }),
      ]);
    });
  });
}
