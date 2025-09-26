/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail } = await req.json();

    if (!orderId || !customerEmail) {
      return new Response(
        JSON.stringify({ error: "Order ID and customer email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if order exists and get order details
    const { data: order, error: orderError } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('customer_email', customerEmail)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If already completed, mint a fresh signed URL again so users can redownload any time
    if (order.status === 'completed') {
      const fileNameFromPathCompleted = (() => {
        try { return (order.photo_path || 'photo.jpg').split('/').pop() || 'photo.jpg'; } catch { return 'photo.jpg'; }
      })();
      const downloadFileNameCompleted = (order.photo_name && String(order.photo_name).trim().length > 0)
        ? String(order.photo_name).trim().replace(/\s+/g, '_')
        : fileNameFromPathCompleted;

      const { data: completedSigned, error: completedSignedErr } = await supabase.storage
        .from('photos')
        .createSignedUrl(order.photo_path, 7 * 24 * 3600, { download: downloadFileNameCompleted });

      if (completedSignedErr) {
        return new Response(
          JSON.stringify({ error: "Failed to generate download URL" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // persist latest signed URL for audit (optional)
      await supabase
        .from('pending_orders')
        .update({ download_url: completedSigned.signedUrl })
        .eq('order_id', orderId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'completed',
          downloadUrl: completedSigned.signedUrl,
          message: "Order already completed"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only allow verification for pending orders (payment made but not yet verified)
    if (order.status !== 'pending') {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: order.status,
          error: "Order is not in pending status for verification."
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate signed URL for clean photo download (valid for 7 days)
    // Include a filename to force browser download instead of opening in a new tab
    const fileNameFromPath = (() => {
      try {
        const last = (order.photo_path || 'photo.jpg').split('/').pop() || 'photo.jpg';
        return last;
      } catch (_) {
        return 'photo.jpg';
      }
    })();

    const downloadFileName = (order.photo_name && String(order.photo_name).trim().length > 0)
      ? String(order.photo_name).trim().replace(/\s+/g, '_')
      : fileNameFromPath;

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('photos')
      .createSignedUrl(order.photo_path, 7 * 24 * 3600, { download: downloadFileName }); // 7 days expiry
    
    if (signedUrlError) {
      console.error('Error generating signed URL:', signedUrlError);
      return new Response(
        JSON.stringify({ error: "Failed to generate download URL" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record purchase in database
    const { error: purchaseError } = await supabase
      .from('photo_purchases')
      .insert({
        photo_path: order.photo_path,
        photo_name: order.photo_name,
        customer_email: order.customer_email,
        customer_name: order.customer_name,
        transaction_id: order.order_id,
        amount: 100.00,
        purchase_date: new Date().toISOString(),
        download_url: signedUrlData.signedUrl,
        download_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      });

    if (purchaseError) {
      console.error('Could not record purchase:', purchaseError);
      return new Response(
        JSON.stringify({ error: "Failed to record purchase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update pending order status
    await supabase
      .from('pending_orders')
      .update({ 
        status: 'completed',
        download_url: signedUrlData.signedUrl,
        completed_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    // Update session payment status if sessionId provided
    if (order.session_id) {
      try {
        await supabase
          .from('photo_sessions')
          .update({ payment_status: 'done' })
          .eq('id', order.session_id);
      } catch (statusErr) {
        console.warn('Failed to update payment status:', statusErr);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: 'completed',
        downloadUrl: signedUrlData.signedUrl,
        message: "Payment verified and download ready"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
