const RAPID_API_KEY = 'a81593e191msh165675ed829b7f3p19e8e3jsna6a26b51decf';
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

// Function to get job details
const getJobDetails = async (jobId) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };
    
    console.log(`Fetching details for job ID: ${jobId}`);
    console.log(`URL: https://jsearch.p.rapidapi.com/job-details?job_id=${encodeURIComponent(jobId)}&country=us`);
    
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/job-details?job_id=${encodeURIComponent(jobId)}&country=us`,
      options
    );
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "OK" && data.data && data.data.length > 0) {
      const jobData = data.data[0];
      
      // Log relevant application links
      console.log('\nJob Details found. Application links:');
      console.log('job_apply_link:', jobData.job_apply_link || 'N/A');
      console.log('job_google_link:', jobData.job_google_link || 'N/A');
      console.log('is_direct:', jobData.job_apply_is_direct);
      
      // Check apply_options
      if (jobData.apply_options && jobData.apply_options.length > 0) {
        console.log('\nApply options:');
        jobData.apply_options.forEach((option, index) => {
          console.log(`[${index}] publisher: ${option.publisher} | direct: ${option.is_direct} | URL: ${option.apply_link}`);
        });
      } else {
        console.log('\nNo apply_options found');
      }
      
      return jobData;
    }
    
    console.log('No job details found or data format unexpected');
    return null;
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
};

// Test with the job ID from our sample
const testJobId = '6W210aOSaejFLMNFAAAAAA==';
getJobDetails(testJobId); 