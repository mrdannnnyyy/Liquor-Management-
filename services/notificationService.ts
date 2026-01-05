// This service simulates sending emails and SMS.
// In a real implementation, this would call a backend endpoint
// which then uses SendGrid and Twilio SDKs.

interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'both';
}

export const sendNotification = async (payload: NotificationPayload) => {
  console.log(`[NOTIFICATION SERVICE] Sending ${payload.type} to ${payload.to}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Body: ${payload.body}`);

  // STUB: Real Implementation Example
  /*
  if (payload.type === 'email' || payload.type === 'both') {
    // using @sendgrid/mail
    await sgMail.send({
      to: payload.to,
      from: 'alerts@myliquorstore.com',
      subject: payload.subject,
      text: payload.body
    });
  }

  if (payload.type === 'sms' || payload.type === 'both') {
    // using twilio
    await twilioClient.messages.create({
      body: payload.body,
      from: '+15550000000',
      to: payload.to // Ensure formatted as E.164
    });
  }
  */

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};
