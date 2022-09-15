module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: getProviderOptions(env),
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

function getProviderOptions(env) {
  const awsAccessOptions = env('NODE_ENV') === "development" ? {
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_ACCESS_SECRET'),
  } : {};

  return {
    ...awsAccessOptions,
    region: env('AWS_REGION'),
    params: {
      Bucket: env('AWS_BUCKET'),
    },
  }
}
