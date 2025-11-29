
import { MAILCHIMP_ACTION_URL } from '../constants';

export const subscribeToMailchimp = (email: string): Promise<{ result: string; msg: string }> => {
  return new Promise((resolve, reject) => {
    // 1. Ensure the URL is valid
    if (!MAILCHIMP_ACTION_URL) {
      reject(new Error('Mailchimp URL is not configured.'));
      return;
    }

    // 2. Convert /post? to /post-json? for JSONP support
    // This allows cross-origin requests from the browser
    const url = MAILCHIMP_ACTION_URL.replace('/post?', '/post-json?');
    
    // 3. Create a unique callback name to avoid collisions
    const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
    
    // 4. Construct the query parameters
    // 'c' is the specific parameter Mailchimp uses for the JSONP callback function
    const params = `&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;
    const scriptUrl = `${url}${params}`;

    // 5. Create the script element
    const script = document.createElement('script');
    script.src = scriptUrl;

    // 6. Define the global callback function that Mailchimp will call
    (window as any)[callbackName] = (data: any) => {
      // Cleanup: remove the function and the script tag
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      
      if (data.result === 'success') {
        resolve({ result: 'success', msg: data.msg });
      } else {
        // Mailchimp sends error messages (like "Already subscribed") in data.msg
        resolve({ result: 'error', msg: data.msg });
      }
    };

    // 7. Handle network errors
    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      reject(new Error('Network error connecting to Mailchimp'));
    };

    // 8. Append script to document to trigger the request
    document.body.appendChild(script);
  });
};
