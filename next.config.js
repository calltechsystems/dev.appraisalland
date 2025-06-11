const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  appDir: true,
  eslint: { ignoreDuringBuilds: true },
  env: {
    CRYPTO_SECRET_KEY: "gjfdkhslbreif847593rewfdkjbcm34woebkdjcnx43oihefdkcnx",
    COOKIE_PASSWORD: "ierfkgj439802vfckdh5438909endck",
    AWS_BUCKET: "appraisalland-files",
    AWS_REGION: "ca-central-1",
    AUTO_RELOADING_DELAY:180000,
    BACKEND_DOMAIN:
      "https://devapi.appraisalland.ca/api",
    BACKEND_DOMAIN2:
      "https://devapi.appraisalland.ca/api",
  },
  images: {
    domains: [
      "appraisalfile.s3.us-east-1.amazonaws.com",
      "appraisallandfiless.s3.amazonaws.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "https://www.paypalobjects.com/webstatic/mktg/logo/",
      "appraisalland-files.s3.ca-central-1.amazonaws.com",
      "www.paypalobjects.com",
    ],
  },
};

module.exports = nextConfig;
