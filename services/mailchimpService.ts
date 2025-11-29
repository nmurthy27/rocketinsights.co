
import { MAILCHIMP_ACTION_URL } from "../constants";

interface MailchimpResponse {
  result: 'success' | 'error';
  msg: string;
}

// Helper to perform JSONP request
// This mimics standard form submission but uses a script tag to avoid CORS issues
const jsonp = (url: string, callback: (data: MailchimpResponse) => void) => {
  const script = document.createElement('script');
  const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  
  // Attach callback to window
  (window as any)[callbackName] = (data: MailchimpResponse) => {
    delete (window as any)[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  // Modify URL to be JSONP compatible
  // Replaces /post? with /post-json? and adds callback parameter
  const jsonpUrl = url.replace('/post?', '/post-json?') + "&c=" + callbackName;
  
  script.src = jsonpUrl;
  document.body.appendChild(script);
};

export const subscribeToMailchimp = (email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!MAILCHIMP_ACTION_URL) {
      console.warn("Mailchimp Action URL is not configured in constants.ts");
      return resolve("Skipped Mailchimp (Configuration Missing)");
    }

    // Prepare params
    const params = `&EMAIL=${encodeURIComponent(email)}`;
    const url = MAILCHIMP_ACTION_URL + params;

    try {
      jsonp(url, (data) => {
        if (data.result === 'success') {
          resolve("Successfully subscribed to Mailchimp");
        } else {
          // Mailchimp error messages can contain HTML, strip it if needed or just log
          console.warn("Mailchimp returned error:", data.msg);
          // We resolve anyway so we don't block the app's main flow
          resolve(`Mailchimp: ${data.msg}`);
        }
      });
    } catch (e) {
      console.error("Mailchimp JSONP Error", e);
      reject(e);
    }
  });
};
