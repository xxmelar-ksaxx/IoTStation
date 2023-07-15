/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

// -----------------------------------
// On start up -> do..


const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_SERVER,
    PHASE_PRODUCTION_BUILD
  } = require('next/constants');
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
  };
  
  const bootServices = async () => {
    return fetch('http://localhost:3000/api/_boot')
    .then(async (res) => {
      const resJson = await res.json();
  
      return JSON.stringify(resJson.bootedServices);
    }).catch(() => false);
  }
  
  module.exports = async (phase, { defaultConfig }) => {
    if (process.argv.includes('dev') && phase === PHASE_DEVELOPMENT_SERVER) {
      console.log('[ next.config.js (dev) ]');
        
    //   const bootedServices = await bootServices();
    //   console.log(`[ next.config.js (dev) ] => bootedServices: ${bootedServices}`);
  
      bootServices();
    } else if (process.argv.includes('start') && phase === PHASE_PRODUCTION_SERVER) {
      console.log('[ next.config.js (start) ]');
  
      // Timeout start
      setTimeout(async () => {
        const bootedServices = await bootServices();
        console.log(`[ next.config.js (start) ] => bootedServices: ${bootedServices}`);
      }, 1000);
    } else if (process.argv.includes('build') && phase === PHASE_PRODUCTION_BUILD) {
      console.log('[ next.config.js (build) ]');
  
      // Boot into static pages? getStaticProps ?
      // pages/staticpage.tsx
      // import bootHandler from '@/boot';
      // const bootedServices = await bootHandler();
    }
  
    return nextConfig;
  };