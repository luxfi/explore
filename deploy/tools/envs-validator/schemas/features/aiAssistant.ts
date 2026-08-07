import * as yup from 'yup';

// The schema rejects unknown NEXT_PUBLIC_* variables, and the container
// validates at startup — a variable set on a deployment but absent here stops
// the pod from booting. The credential itself (AI_API_KEY) is server-side and
// deliberately not a NEXT_PUBLIC_ variable, so it is not validated here.
export const aiAssistantSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_AI_ASSISTANT_ENABLED: yup.boolean(),
    NEXT_PUBLIC_AI_ASSISTANT_MODEL: yup
      .string()
      .when('NEXT_PUBLIC_AI_ASSISTANT_ENABLED', {
        is: (value: boolean) => value,
        then: (schema) => schema,
        otherwise: (schema) => schema.max(
          -1,
          'NEXT_PUBLIC_AI_ASSISTANT_MODEL cannot be used if NEXT_PUBLIC_AI_ASSISTANT_ENABLED is not set to "true"',
        ),
      }),
  });
