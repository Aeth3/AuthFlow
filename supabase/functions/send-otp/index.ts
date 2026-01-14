// supabase/functions/send-otp/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { email } = await req.json();
  if (!email) return new Response("Missing email", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase.auth.admin.listUsers({
    filter: `email.eq.${email}`,
  });

  if (error || !data.users.length)
    return new Response("User not found", { status: 404 });

  const user = data.users[0];
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in user metadata
  await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { reset_otp: code, otp_expiry: Date.now() + 10 * 60 * 1000 },
  });

  // Send email (using Resend, SendGrid, etc.)
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "no-reply@yourapp.com",
      to: email,
      subject: "Password Reset Code",
      html: `<p>Your password reset code is <b>${code}</b></p>`,
    }),
  });

  return new Response("OTP sent", { status: 200 });
});
