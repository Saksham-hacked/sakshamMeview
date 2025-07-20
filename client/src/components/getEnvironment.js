// const envApi = "localhost:9897";
// export { envApi };

function getEnvironment() {
  const currentURL = window.location.href;
  const development = 'http://localhost:9897';
//   const production = 'https://nitjtt.onrender.com';
//   const nitjServer = 'https://xceed.nitj.ac.in';
  if (currentURL.includes('localhost')) {
    return development;
  }
  // if (currentURL.includes('nitjtt.onrender.com')) {
  //   return production;
  // }
  // if (currentURL.includes('xceed.nitj.ac.in')) {
  //   return nitjServer;
  // }
  return development;
}

export default getEnvironment;
