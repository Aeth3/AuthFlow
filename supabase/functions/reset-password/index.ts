// supabase/functions/send-otp/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { email } = await req.json();
    if (!email) return new Response("Missing email", { status: 400 });

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
    );

    // Find user
    const { data, error } = await supabase.auth.admin.listUsers({
      filter: `email.eq.${email}`,
    });
    console.log("data",data);
    
    if (error || !data.users.length)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const user = data.users[0];
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in metadata (10-minute expiry)
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { reset_otp: code, otp_expiry: Date.now() + 10 * 60 * 1000 },
    });

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // ✅ safe temporary sender
        to: "amajunriel.damalan@gmail.com",
        subject: "Your password reset code",
        html: `<p>Your password reset code is <b>${code}</b>. It expires in 10 minutes.</p>`,
      }),
    });

    const result = await response.text();
    console.log("Resend API response:", result);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Email failed to send" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

