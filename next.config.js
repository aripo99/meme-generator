/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}
module.exports = nextConfig
