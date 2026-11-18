# WhatsApp templates (DotCom by Arshees)

Create each in **WhatsApp Manager → Message templates → Create** — Category **Utility**, language **English (en)**, name exactly as below. A message may not start or end with a variable (hence "Thank you." at the end). Variables `{{1}}`… are filled by the helper in this order. Add a sample value for each variable when Meta asks.

| Name | Body |
|---|---|
| `booking_received` | Hello {{1}}, we have received your booking request with {{2}} at {{3}} for {{4}}. You will get a confirmation once the clinic verifies your payment. For questions, WhatsApp the clinic at {{5}}. Thank you. |
| `booking_confirmed` | Hello {{1}}, your consultation with {{2}} at {{3}} is confirmed for {{4}} (IST). Join on time here: {{5}} Thank you. |
| `booking_declined` | Hello {{1}}, sorry, {{2}} at {{3}} cannot take your booking for {{4}}. Please book another time or WhatsApp the clinic at {{5}}. If you paid, the clinic will refund you. |
| `reminder_24h` | Reminder: Hello {{1}}, your consultation with {{2}} is tomorrow, {{3}} (IST). Join here: {{4}} Thank you. |
| `reminder_1h` | Reminder: Hello {{1}}, your consultation with {{2}} starts at {{3}} (IST), in about an hour. Join here: {{4}} Thank you. |
| `review_request` | Hello {{1}}, thank you for consulting {{2}}. If you were happy with your care, please leave a short Google review: {{3}} Thank you. |
| `followup_reminder` | Hello {{1}}, {{2}} would like to see you for a review around {{3}}. Book your review here: {{4}} Thank you. |
| `doctor_new_booking` | New booking for {{1}}: {{2}}, {{3}}, {{4}} (IST). Open your dashboard to confirm. |

Auto-reply for patient messages (WhatsApp Manager → the number → Away/greeting, or later via webhook):
"This number only sends appointment updates. For questions, please WhatsApp the clinic directly — the number is in your messages."

Notes
- Meta may classify `review_request` as Marketing (costs more). If it is rejected as Utility, resubmit as Marketing.
- Templates made on the **test number** must be created again on the real +91 number.
