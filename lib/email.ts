import { Resend } from 'resend'
import { getFromAddress, getReplyToAddress } from '@/lib/brand-contact'

export type SendEmailInput = {
  to: string
  subject: string
  text: string
  html?: string
  /** Override default reply-to (e.g. client email for owner notify). */
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; message: string; code?: 'missing_config' | 'send_failed' }

/** Send a transactional email via Resend. Requires RESEND_API_KEY. */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return {
      ok: false,
      code: 'missing_config',
      message:
        'Email isn’t configured yet. Add RESEND_API_KEY to your environment to send emails.',
    }
  }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: input.to,
    replyTo: input.replyTo?.trim() || getReplyToAddress(),
    subject: input.subject,
    text: input.text,
    html:
      input.html ??
      `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(input.text)}</pre>`,
  })

  if (error) {
    return {
      ok: false,
      code: 'send_failed',
      message: error.message || 'Could not send the email. Please try again.',
    }
  }

  return { ok: true, id: data?.id ?? 'sent' }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
